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
<<<<<<< HEAD
        const secret = configService.get<string>('JWT_ACCESS_SECRET', "HELLLO");
        
=======
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
>>>>>>> 60e13674c0e9fbf2af4ee578d621118398540c06

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
