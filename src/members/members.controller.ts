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
import { AuthGuard } from 'src/user/auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Members')
@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @UseGuards(AuthGuard)
    @Post(':familyId')
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

    @UseGuards(AuthGuard)
    @Get(':familyId')
    @ApiParam({ name: 'familyId', description: 'The ID of the family', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of members retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Family not found' })
    async getMembersByFamily(@Param('familyId') familyId: number): Promise<Member[]> {
        return this.membersService.getMembersByFamily(familyId);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiResponse({ status: HttpStatus.OK, description: 'List of all members retrieved successfully' })
    async getAllMembers(): Promise<Member[]> {
        return this.membersService.getAllMembers();
    }

    @UseGuards(AuthGuard)
    @Get('member/:memberId')
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member details retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async getMemberById(@Param('memberId') memberId: number): Promise<Member> {
        return this.membersService.getMemberById(memberId);
    }

    @UseGuards(AuthGuard)
    @Put('member/:memberId')
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiBody({ type: UpdateMemberDTO })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async updateMember(
        @Param('memberId') memberId: number,
        @Body() updateData: UpdateMemberDTO,
    ): Promise<Member> {
        return this.membersService.updateMember(memberId, updateData);
    }

    @UseGuards(AuthGuard)
    @Delete('member/:memberId')
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: 'memberId', description: 'The ID of the member', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async deleteMember(@Param('memberId') memberId: number): Promise<{ message: string }> {
        return this.membersService.deleteMember(memberId);
    }
}
