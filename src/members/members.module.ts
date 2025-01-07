import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { Family } from 'src/families/families.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, Family, User]),
        SharedModule
    ],
    exports:[TypeOrmModule],
    controllers: [MembersController],
    providers:[MembersService, UserService]
})
export class MembersModule {}
