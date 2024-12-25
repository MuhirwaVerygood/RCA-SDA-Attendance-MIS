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
import { Member } from './members.entity';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    // Add a new member to a family
    @UseGuards(AuthGuard)
    @Post(':familyId')
    async addMember(
        @Param('familyId') familyId: number,
        @Body() memberData: Partial<Member>,
    ): Promise<Member> {
        return this.membersService.addMemberToFamily(familyId, memberData);
    }

    // Get all members of a family
    @UseGuards(AuthGuard)
    @Get(':familyId')
    async getMembersByFamily(@Param('familyId') familyId: number): Promise<Member[]> {
        return this.membersService.getMembersByFamily(familyId);
    }

    //Get all Church Members
    @UseGuards(AuthGuard)
    @Get()
    async getAllMembers(): Promise<Member[]>{
        return this.membersService.getAllMembers()
    }    

    // Get a specific member by ID
    @UseGuards(AuthGuard)
    @Get('member/:memberId')
    async getMemberById(@Param('memberId') memberId: number): Promise<Member> {
        return this.membersService.getMemberById(memberId);
    }

    // Update a member's details
    @UseGuards(AuthGuard)
    @Put('member/:memberId')
    async updateMember(
        @Param('memberId') memberId: number,
        @Body() updateData: Partial<Member>,
    ): Promise<Member> {
        return this.membersService.updateMember(memberId, updateData);
    }

    // Delete a member
    @UseGuards(AuthGuard)
    @Delete('member/:memberId')
    @HttpCode(HttpStatus.OK)
    async deleteMember(@Param('memberId') memberId: number): Promise<{message:string}> {
        return this.membersService.deleteMember(memberId);
    }
}
