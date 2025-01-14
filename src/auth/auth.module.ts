import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FamiliesService } from 'src/families/families.service';
import { Family } from 'src/families/families.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { Member } from 'src/members/members.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Family ,  Member]),
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, FamiliesService,  AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }