import { Controller, Get, Post, Body, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    async create(@Body() data: Partial<User>): Promise<any> {
        return this.userService.create(data);
    }


    @Post('signin')
    @HttpCode(200) 
    async login(@Body() data: Partial<User>): Promise<{message: string, token: string, user: object}> {
        return this.userService.login(data);
    }


    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.userService.getProfile(req);
    }
}




