import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { User } from './user.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'The user with that email already exists' })
  signup(@Body() createUserDto: Partial<User>) {
    return this.authService.signUp(createUserDto);
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
  signin(@Body() data: LoginUserDTO, @Res() res) {
    return this.authService.signIn(data, res);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req);
  }


  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  refreshTokens(@Req() req: Request, @Res() res) {

    return this.authService.refreshTokens(req , res);

  }
} 