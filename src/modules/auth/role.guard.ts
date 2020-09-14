import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.role;
        const requiredRole = this.reflector.get<string>('role', context.getHandler());

        if (!requiredRole) {
            return true;
        } 
        
        return userRole === requiredRole;
    }
}
