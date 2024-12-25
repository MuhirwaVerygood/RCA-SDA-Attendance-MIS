import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { FamiliesService } from './families.service';
import { Family } from './families.entity';

@Controller('families')
export class FamiliesController {
    constructor(private readonly familiesService: FamiliesService) { }

    // Create a new family
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createFamily(
        @Body() familyData: { familyName: string; father: string; mother: string },
    ): Promise<Family> {
        const { familyName, father, mother } = familyData;
        return this.familiesService.createFamily(familyName, father, mother);
    }

    // Get all families
    @Get()
    async getAllFamilies(): Promise<Family[]> {
        return this.familiesService.getAllFamilies();
    }

    // Get a family by ID
    @Get(':id')
    async getFamilyById(@Param('id') id: number): Promise<Family> {
        const family = await this.familiesService.getFamilyById(id);
        if (!family) {
            throw new NotFoundException(`Family with ID ${id} not found`);
        }
        return family;
    }

    // Update a family's details
    @Put(':id')
    async updateFamily(
        @Param('id') id: number,
        @Body() familyData: { familyName?: string; father?: string; mother?: string },
    ): Promise<Family> {
        const { familyName, father, mother } = familyData;
        return this.familiesService.updateFamily(id, familyName, father, mother);
    }

    // Delete a family
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteFamily(@Param('id') id: number): Promise<{message: string}> {
        return this.familiesService.deleteFamily(id);
    }
}
