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
        const requiredPermissions = this.reflector.get<Permission[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions) {
            return true; // No permissions required
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('User role not found');
        }

        const userPermissions = RolesPermissions[user.role] || [];
        const hasPermission = requiredPermissions.every((perm) =>
            userPermissions.includes(perm),
        );

        if (!hasPermission) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
