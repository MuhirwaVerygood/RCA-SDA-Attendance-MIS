import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from 'src/families/families.entity';
import { Attendance } from './attendance.entity';
import { UserService } from 'src/user/user.service';
import { FamiliesService } from 'src/families/families.service';
import { User } from 'src/auth/user.entity';
import { Member } from 'src/members/members.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attendance, Family, User , Member])],
  controllers: [AttendanceController],
  providers: [AttendanceService, UserService, FamiliesService], 
  exports: [TypeOrmModule]
})
  
export class AttendanceModule {}
