import { SetMetadata } from '@nestjs/common';
import { Permission } from './shared.permission.enum';

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);