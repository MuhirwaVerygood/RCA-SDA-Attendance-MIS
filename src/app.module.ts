import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FamiliesController } from './families/families.controller';
import { MembersController } from './members/members.controller';
import { MembersService } from './members/members.service';
import { FamiliesService } from './families/families.service';
import { FamiliesModule } from './families/families.module';
import { MembersModule } from './members/members.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { SharedModule } from './shared/shared.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true  , envFilePath: ".env"}),
    UserModule,
    FamiliesModule,
    MembersModule,
    SharedModule,
    SharedModule,
    AttendanceModule,
    AuthModule
  ],
  controllers: [AppController, FamiliesController, MembersController],
  providers: [AppService, MembersService, FamiliesService, JwtService, UserService],
})
export class AppModule {}
