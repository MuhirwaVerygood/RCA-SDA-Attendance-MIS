import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags,  ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/shared.roleguard';
import {  InviteFamilyHeadDto} from 'src/auth/user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @ApiOperation({ summary: 'Get a user profile' })
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile retrieved successfully',
        schema: {
            example: {
                id: 1,
                username: 'johndoe',
                email: 'user@example.com',
                isAdmin: false,
                isFather: false,
                isMother: true,
            },
        },
    })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
    getProfile(@Request() req) {
        return this.userService.getProfile(req);
    }

    @UseGuards(AccessTokenGuard)
    @Post("familyHeads")
    async addFamilyHeads(@Body() invitationRequest: InviteFamilyHeadDto , @Req() req ): Promise<{message:string}> {
        return await this.userService.addFamilyHeads(invitationRequest, req);
    }
}
 