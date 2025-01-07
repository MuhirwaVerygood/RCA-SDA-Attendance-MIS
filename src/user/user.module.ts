import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
    providers: [UserService],
})
export class UserModule { }
