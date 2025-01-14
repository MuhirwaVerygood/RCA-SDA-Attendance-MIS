import {  ConflictException, ForbiddenException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import {  Response } from 'express';
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

    async signIn(data: LoginUserDTO, @Res() res: Response) : Promise<any>{    
        const user = await this.userRepository.findOne({where:{email : data.email} , relations:["family"]});        
        if (!user) throw new UnauthorizedException('Invalid password or email');
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
            throw new UnauthorizedException('Invalid password or email');
        const tokens = await this.getTokens(user);


        await this.updateRefreshToken(user.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken)
        res.cookie("accessToken", tokens.accessToken)

        
        const {password, refreshToken,  ...userWithoutPassword} = user;
        return res.json({message:"Login Successful" , user: userWithoutPassword });
        }


    async logout(req: any) {
        return this.usersService.update(req.user.id, { refreshToken: "" });
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
                    isFather: user.isFather,
                    isMother: user.isMother,
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
                    isFather: user.isFather,
                    isMother: user.isMother,
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


    async refreshTokens(req: any, @Res() res: Response) {        
        const refreshToken = req.cookies?.refreshToken;
        
    
        if (!req.user) {
            throw new ForbiddenException('Access Denied: User information missing');
        }

        const user = await this.userRepository.findOne({
            where: { id: req.user.id },
            select: ['id', 'refreshToken'],
        });


        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied: Invalid user or token');
        }
    


        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );

        
    
        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied: Token mismatch');
        }

       const newAccessToken  = await this.generateAccessToken(user)
            
        res.cookie("accessToken", newAccessToken ) 
        return res.json({access_token: newAccessToken})
    }




    async generateAccessToken(user: {
        id: number;
        isAdmin: boolean;
        isFather: boolean;
        isMother: boolean;
    }): Promise<string> {
        const accessToken = await this.jwtService.signAsync(
            {
                id: user.id,
                isAdmin: user.isAdmin,
                isFather: user.isFather,
                isMother: user.isMother,
            },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            },
        );

        return accessToken;
    }

}