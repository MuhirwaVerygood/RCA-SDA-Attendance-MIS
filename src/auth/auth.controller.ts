import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {  LoginUserDTO } from './user.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() createUserDto: Partial<User>) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: LoginUserDTO, @Res() res) {
    return this.authService.signIn(data, res);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req);
  }


  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    return this.authService.refreshTokens(req);
  }
}