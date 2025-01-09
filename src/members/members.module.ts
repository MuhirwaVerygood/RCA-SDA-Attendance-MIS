import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { Family } from 'src/families/families.entity';
import { UserService } from 'src/user/user.service';
import { SharedModule } from 'src/shared/shared.module';
import { FamiliesService } from 'src/families/families.service';
import { User } from 'src/auth/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, Family, User]),
        SharedModule
    ],
    exports:[TypeOrmModule],
    controllers: [MembersController],
    providers:[MembersService, UserService , FamiliesService]
})
export class MembersModule {}
