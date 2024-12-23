import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post()
    async create(@Body() data: Partial<User>): Promise<Partial<User>> {
        return this.userService.create(data);
    }


    @Post('signin')
    async login(@Body() data: Partial<User>): Promise<{message: string, token: string}> {
        return this.userService.login(data);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.userService.getProfile(req);
    }
}
