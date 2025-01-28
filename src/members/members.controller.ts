import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    Get,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDTO, UpdateMemberDTO } from './members.dto';
import { Member } from './members.entity';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiBearerAuth('access-token')
@ApiTags('Members')
@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @UseGuards(AccessTokenGuard)
    @Post(':familyId')
    @ApiOperation({ summary: 'Add a new member to a family' })    
    @ApiParam({ name: 'familyId', description: 'The ID of the family', example: 1 })
    @ApiBody({ type: CreateMemberDTO })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Member added successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found' })
    async addMember(
        @Param('familyId') familyId: number,
        @Body() memberData: CreateMemberDTO,
    ): Promise<Member> {
        return this.membersService.addMemberToFamily(familyId, memberData);
    }

    @UseGuards(AccessTokenGuard)
    @Get(':familyId')
    @ApiOperation({ summary: 'Delete a member by family ID' })
    @ApiParam({ name: 'familyId', description: 'The ID of the family', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of members retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found' })
    async getMembersByFamily(@Param('familyId') familyId: number): Promise<Member[]> {
        return this.membersService.getMembersByFamily(familyId);
    }

    @UseGuards(AccessTokenGuard)
    @Get()
    @ApiOperation({ summary: 'Get all members' })    
    @ApiResponse({ status: HttpStatus.OK, description: 'List of all members retrieved successfully' })
    async getAllMembers(): Promise<Member[]> {
        return this.membersService.getAllMembers();
    }

    @UseGuards(AccessTokenGuard)
    @Get('member/:memberId')
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiOperation({ summary: 'Get a member by member ID' })    
    @ApiResponse({ status: HttpStatus.OK, description: 'Member details retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async getMemberById(@Param('memberId') memberId: number): Promise<Member> {
        return this.membersService.getMemberById(memberId);
    }

    @UseGuards(AccessTokenGuard)
    @Put('member/:memberId')
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiOperation({ summary: 'Update a member by member ID' })    
    @ApiBody({ type: UpdateMemberDTO })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async updateMember(
        @Param('memberId') memberId: number,
        @Body() updateData: UpdateMemberDTO,
    ): Promise<Member> {
        return this.membersService.updateMember(memberId, updateData);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('member/:memberId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a member by member ID' })      
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async deleteMember(@Param('memberId') memberId: number): Promise<{ message: string }> {
        return this.membersService.deleteMember(memberId);
    }
}
