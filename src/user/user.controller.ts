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
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDTO,  InviteFamilyHeadDto, LoginUserDTO } from './user.dto';
import { RolesGuard } from 'src/shared/shared.roleguard';
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a user' })    
    @ApiBody({ type: CreateUserDTO })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'The user with that email already exists' })
    async create(@Body() data: CreateUserDTO): Promise<any> {
        return this.userService.create(data);
    }

    @Post('signin')
    @HttpCode(200)
    @ApiBody({ type: LoginUserDTO })
    @ApiOperation({ summary: 'Login a user' })    
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Logged in successfully',
        schema: {
            example: {
                message: 'Logged in successfully',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    username: 'johndoe',
                    email: 'user@example.com',
                    isAdmin: false,
                    isFather: false,
                    isMother: true,
                },
            },
        },
    })
        
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid password or email' })
    async login(@Body() data: LoginUserDTO): Promise<{ message: string; token: string; user: object }> {
        return this.userService.login(data);
    }

    @ApiOperation({ summary: 'Get a user profile' })

    @UseGuards(AuthGuard, RolesGuard)
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

    @UseGuards(AuthGuard)
    @Post("familyHeads")
    async addFamilyHeads(@Body() invitationRequest: InviteFamilyHeadDto , @Req() req ): Promise<{message:string}> {
        return await this.userService.addFamilyHeads(invitationRequest, req.user.email);
    }
}
