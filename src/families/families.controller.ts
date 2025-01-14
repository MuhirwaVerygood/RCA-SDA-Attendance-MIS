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
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { Family } from './families.entity';
import { CreateFamilyDto, UpdateFamilyDto } from './families.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('Families')
@ApiBearerAuth()
@Controller('families')
export class FamiliesController {
    constructor(private readonly familiesService: FamiliesService) { }

    @UseGuards(AccessTokenGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new family' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Family created successfully.', type: Family })
    async createFamily(@Body() familyRequest: CreateFamilyDto): Promise<object> {
        return this.familiesService.createFamily(familyRequest);
    }

    @UseGuards(AccessTokenGuard)
    @Get()
    @ApiOperation({ summary: 'Get all families' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of families retrieved successfully.', type: [Family] })
    async getAllFamilies(): Promise<Family[]> {
        return this.familiesService.getAllFamilies();
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get a family by ID' })
    @ApiParam({ name: 'id', description: 'Unique ID of the family', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'Family retrieved successfully.', type: Family })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found.' })
    async getFamilyById(@Param('id') id: number): Promise<Family> {
        const family = await this.familiesService.getFamilyById(id);
        if (!family) {
            throw new NotFoundException(`Family with ID ${id} not found.`);
        }
        return family;
    }

    @UseGuards(AccessTokenGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update family details' })
    @ApiParam({ name: 'id', description: 'Unique ID of the family to update', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'Family updated successfully.', type: Family })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found.' })
    async updateFamily(@Param('id') id: number, @Body() updateFamilyDto: UpdateFamilyDto): Promise<Family> {
        const { familyName, father, mother } = updateFamilyDto;
        return this.familiesService.updateFamily(id, familyName, father, mother);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a family' })
    @ApiParam({ name: 'id', description: 'Unique ID of the family to delete', example: 1 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Family deleted successfully.',
        schema: { type: 'object', properties: { message: { type: 'string', example: 'Family deleted successfully.' } } },
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found.' })
    async deleteFamily(@Param('id') id: number): Promise<{ message: string }> {
        return this.familiesService.deleteFamily(id);
    }
}
