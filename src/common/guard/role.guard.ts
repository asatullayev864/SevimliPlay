import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        ctx: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();

        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        if (!roles || roles.length === 0) {
            return true;
        }

        const upperRoles = roles.map((role) => role.toUpperCase());

        if (upperRoles.includes("PUBLIC")) {
            return true;
        }

        if (!req.user) {
            throw new ForbiddenException("Foydalanuvchi aniqlanmadi (token noto'g'ri yoki yo'q).");
        }

        const userRole = req.user.role?.toUpperCase();

        if (userRole && upperRoles.includes(userRole)) {
            return true;
        }

        if (upperRoles.includes("ID") && req.user.id === +req.params.id) {
            return true;
        }

        throw new ForbiddenException("Sizda bu amalni bajarish uchun huquq yo'q.");
    }
}