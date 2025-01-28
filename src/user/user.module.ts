import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FamiliesService } from 'src/families/families.service';
import { Family } from 'src/families/families.entity';
import { User } from 'src/auth/user.entity';
import { Member } from 'src/members/members.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Family , Member , Attendance]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>("SECRET", "INITIAL VALUE"),
                signOptions: {
                    expiresIn:"1d"
                }
            })
        })
    ],
         
    exports:[TypeOrmModule],
    controllers: [UserController],
    providers: [UserService, FamiliesService],
})
export class UserModule { }
