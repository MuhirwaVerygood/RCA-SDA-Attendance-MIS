import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { Family } from './families.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Family , User]),
        JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        global: true,
                        secret: configService.get<string>("SECRET", "INITIAL VALUE"),
                        signOptions: {
                            expiresIn:"1h"
                        }
                    })
                })
    ],
    providers: [FamiliesService, UserService],
    controllers: [FamiliesController],
    exports:[TypeOrmModule]
})
export class FamiliesModule {}
