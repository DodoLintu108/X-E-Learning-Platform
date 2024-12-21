import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { RolePermissions } from './roles-permissions';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      if (!requiredRoles) {
        return true; // No roles required, allow access.
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user; // User should be attached via authentication middleware.
  
      if (!user || !RolePermissions[user.role]) {
        throw new ForbiddenException('Access Denied: Invalid Role');
      }
  
      const userPermissions = RolePermissions[user.role];
      const hasPermission = requiredRoles.every((role) =>
        userPermissions.includes(role),
      );
  
      if (!hasPermission) {
        throw new ForbiddenException('Access Denied');
      }
  
      return true;
    }
  }
  