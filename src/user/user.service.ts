import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async create(data: Partial<User>): Promise<Partial<User>> {
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
        return userWithoutPassword;
    }

}
