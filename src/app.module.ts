import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    UserModule,
    FamiliesModule,
    MembersModule,
    SharedModule,
    AttendanceModule,
    AuthModule
  ],
  controllers: [FamiliesController, MembersController],
  providers: [MembersService, FamiliesService, JwtService, UserService],
})  
export class AppModule { }


