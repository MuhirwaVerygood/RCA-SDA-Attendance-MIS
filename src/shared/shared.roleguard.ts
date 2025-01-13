import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './shared.permission.enum';
import { RolesPermissions } from './shared.roles.permissions';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get the required permissions from the handler
        const requiredPermissions = this.reflector.get<Permission[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions) {
            return true; // No permissions required
        }

        // Get the request and user profile
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        
        if (!user) {
            throw new ForbiddenException('No user found in the request');
        }

        // Determine the user's roles
        console.log(user);
        
        const userRoles = this.getUserRoles(user);

        
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
     * Determine the roles of the logged-in user based on their profile.
     */
    private getUserRoles(user: any): string[] {
        const roles = [];
        if (user.isAdmin) roles.push('admin');
        if (user.isFather) roles.push('father');
        if (user.isMother) roles.push('mother');
        return roles;
    }
}
