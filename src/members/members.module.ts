import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { Family } from 'src/families/families.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, Family, User]),
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
    controllers: [MembersController],
    providers:[MembersService, UserService]
})
export class MembersModule {}
