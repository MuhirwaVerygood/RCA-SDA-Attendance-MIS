import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { Family } from './families.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Family])
    ],
    providers: [FamiliesService],
    controllers: [FamiliesController],
    exports:[TypeOrmModule]
})
export class FamiliesModule {}
