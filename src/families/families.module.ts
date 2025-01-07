import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { Family } from './families.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Family , User]),
        SharedModule
    ],
    providers: [FamiliesService, UserService],
    controllers: [FamiliesController],
    exports:[TypeOrmModule]
})
export class FamiliesModule {}
