import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDTO } from './user.dto';
import { UserService } from 'src/user/user.service';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,   
        private usersService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        
    ) { }

    async signUp(createUserDto: Partial<User>): Promise<any> {
        const userExists = await this.userRepository.findOne({where:{ email: createUserDto.email}})
        if (userExists) {
            throw new ConflictException('User with that email already exists');
        }

        // Hash password
        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.userRepository.create({
            ...createUserDto,
            password: hash,
        });

        await this.userRepository.save(newUser)

        const tokens = await this.getTokens(newUser);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: LoginUserDTO) {
        const user = await this.userRepository.findOne({where:{email : data.email}});        
        if (!user) throw new UnauthorizedException('Invalid password or email');
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
            throw new UnauthorizedException('Invalid password or email');
        const tokens = await this.getTokens(user );
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password, ...userWithoutPassword } = user;
        return { message: "Logged in successfully", tokens, user: userWithoutPassword};
    }

    async logout(req: any) {
        return this.usersService.update(req.user.id, { refreshToken: null });
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: user.id,
                    isAdmin: user.isAdmin,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    id: user.id,
                    isAdmin: user.isAdmin,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }


    async refreshTokens(req: any) {        
        const user = await this.userRepository.findOne({
            where: { id: req.user.id },
            select: ['id', 'refreshToken'], 
        });
        console.log(user);
        
        if (!user || !user.refreshToken)
        
            throw new ForbiddenException('Access Denied');
        

        
        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            req.user.refreshToken,
        );

        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}