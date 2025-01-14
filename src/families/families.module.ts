import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { Family } from './families.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { SharedModule } from 'src/shared/shared.module';
import { User } from 'src/auth/user.entity';
import { Member } from 'src/members/members.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Family, User, Member]),
        SharedModule
    ],
    providers: [FamiliesService, UserService],
    controllers: [FamiliesController],
    exports:[TypeOrmModule]
})
export class FamiliesModule {}
