import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private readonly configService: ConfigService) {
        const secret = configService.get<string>('JWT_REFRESH_SECRET');
        super({
            jwtFromRequest: (req: Request) => {
                // Retrieve the refresh token from cookies
                if (req && req.cookies) {
                    return req.cookies.refreshToken;
                }
                return null;
            },
            secretOrKey: secret,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.refreshToken;
        return { ...payload, refreshToken };
    }
}
