import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    HttpStatus,
    Req,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags,  ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/shared.roleguard';
import {  AddAdminDto} from 'src/auth/user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request as Rq } from 'express';
import { Permission } from 'src/shared/shared.permission.enum';
import { Permissions } from 'src/shared/shared.permissions.decorator';


interface CustomRequest extends Rq {
    user?: {
        id: number;
    };
}

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

    @UseGuards(AccessTokenGuard, RolesGuard)
        @Permissions(Permission.AddAdmin)
    @Post("/admin/add")
    async addFamilyHeads(@Body() adminAdditionRequest: AddAdminDto , @Req() req ): Promise<{message:string}> {
        return await this.userService.addAdmin(adminAdditionRequest, req);
    }

    @Put("/profile")
    async updateProfile(@Body() userData: any, @Req() req: CustomRequest) {
                return this.userService.update(req?.user?.id, userData)
    }
}
 