import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from 'src/families/families.entity';
import { Attendance } from './attendance.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attendance, Family, User])],
  controllers: [AttendanceController],
  providers: [AttendanceService, UserService], 
  exports: [TypeOrmModule]
})
export class AttendanceModule {}
