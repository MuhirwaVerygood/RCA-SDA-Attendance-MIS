import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload = {
    id: number;
    isAdmin: boolean;
    isFather: boolean;
    isMother: boolean;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');

        super({
            jwtFromRequest: (req: Request) => {
                // Extract the access token from cookies
                if (req && req.cookies) {
                    return req.cookies.accessToken;
                }
                return null;
            },
            secretOrKey: secret,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
