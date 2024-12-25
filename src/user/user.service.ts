import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
  
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    

    async findById(id: number): Promise<User>{
        return this.userRepository.findOne({where:{id}})
    }

    async create(data: Partial<User>): Promise<any> {
        if (!data.isAdmin) {
            throw new HttpException('Not allowed', HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
        }

        const user = this.userRepository.create({
            ...data,
            password: await bcrypt.hash(data.password, 10),
        });
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser; 
        return { message:"User registered successfully", user:userWithoutPassword};
    }

    async login(data: Partial<User>): Promise<{message: string, token: string, user: object}>{
        const userExists = await this.userRepository.findOne({ where: { email: data.email } })
        if (!userExists) throw new HttpException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        const passwordMatches = await bcrypt.compare(data.password, userExists.password);
        if (!passwordMatches)throw new HttpException("Invalid email or password", HttpStatus.UNAUTHORIZED)
        const payload = { id: userExists.id, isAdmin: userExists.isAdmin }
        const {password, ...result} = userExists
        return {
            message: "Logged in successfuly",
            user: result,
            token: await this.jwtService.signAsync(payload)
        }
    }

    getProfile(req: any) {
        const { password, ...result } = req?.user;
        return result;
    }
}
