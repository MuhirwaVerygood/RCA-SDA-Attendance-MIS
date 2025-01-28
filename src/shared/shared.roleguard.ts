import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Permission } from './shared.permission.enum';
import { RolesPermissions } from './shared.roles.permissions';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService, 
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Get the required permissions from the handler
        const requiredPermissions = this.reflector.get<Permission[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions) {
            return true; 
        }

        // Get the request object
        const request = context.switchToHttp().getRequest();
        const accessToken = this.getTokenFromCookies(request);

        if (!accessToken) {
            throw new ForbiddenException('Access token not found in cookies');
        }

        // Decode the token to get user details
        let decoded: any;
        try {
            const jwtSecret = this.configService.get<string>('JWT_ACCESS_SECRET'); // Use ConfigService
            decoded= this.jwtService.verify(accessToken, {
                secret: jwtSecret,
            });
        } catch (err) {
            throw new ForbiddenException('Invalid or expired access token');
        }

        if (!decoded) {
            throw new ForbiddenException('No user found in the decoded token');
        }

        const userRoles = await this.getUserRoles(decoded.id);        

        if (!userRoles.length) {
            throw new ForbiddenException('User has no valid roles');
        }

        // Aggregate permissions for all roles
        const userPermissions = userRoles.flatMap((role) => RolesPermissions[role] || []);

        // Check if the user has all required permissions
        const hasPermission = requiredPermissions.every((perm) =>
            userPermissions.includes(perm),
        );

        if (!hasPermission) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }

    /**
     * Extract the token from cookies.
     */
    private getTokenFromCookies(request: any): string | null {
        return request.cookies?.accessToken || null;
    }

    /**
     * Determine the roles of the logged-in user based on their profile.
     */
    async getUserRoles(userId: any): Promise<string[]> {
        const user = await this.userService.findById(userId);
        const roles = [];
        if (user.isAdmin) roles.push('admin');
        if (user.isFather) roles.push('father');
        if (user.isMother) roles.push('mother');
        return roles;
    }
}
