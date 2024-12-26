import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDTO, LoginUserDTO } from './user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    @ApiBody({ type: CreateUserDTO })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'The user with that email already exists' })
    async create(@Body() data: CreateUserDTO): Promise<any> {
        return this.userService.create(data);
    }

    @Post('signin')
    @HttpCode(200)
    @ApiBody({ type: LoginUserDTO })
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

    @UseGuards(AuthGuard)
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
}
