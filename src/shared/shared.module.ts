import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from 'src/families/families.entity';
import { Member } from 'src/members/members.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { User } from 'src/auth/user.entity';

@Global() 
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('SECRET', 'INITIAL VALUE'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USERNAME', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', 'password'),
                database: configService.get<string>('DB_NAME', 'test'),
                autoLoadEntities: true,
                entities: [User, Family , Member],
                synchronize: true
            }),

        }),

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('EMAIL_HOST'),
                    auth: {
                        user: configService.get<string>('EMAIL_USERNAME'),
                        pass: configService.get<string>('EMAIL_PASSWORD'),
                    },
                },
            }),
        }),
    ],
    exports: [JwtModule, TypeOrmModule , MailerModule],
})
export class SharedModule { }
