import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/decorator/is-public.decorator";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly reflector: Reflector,
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(
            IS_PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        
        const req = context.switchToHttp().getRequest();
        
        if (isPublic) {
            req.isRoutePublic = true;
            
            return true;
        }
        
        const rawToken = req.headers['authorization'];
        
        if (!rawToken) {
            throw new UnauthorizedException("Token not found");
        }
        
        const token = this.authService.extractTokenFromHeader(rawToken, true);
        
        if (!token) {
            throw new UnauthorizedException("Invalid token");
        }
        
        const result = this.authService.verifyToken(token);
        
        const user = await this.userService.getUserByEmail(result.email);
        
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        
        req.user = user;
        req.token = token;
        req.tokenType = result.type;
        
        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        
        const req = context.switchToHttp().getRequest();
        
        if(req.isRoutePublic){
            return true;
        }
        
        if (req.tokenType !== 'access') {
            throw new UnauthorizedException('Access token is required');
        }
        
        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        
        const req = context.switchToHttp().getRequest();
        
        if(req.isRoutePublic){
            return true;
        }
        
        if (req.tokenType !== 'refresh') {
            throw new UnauthorizedException('Refresh token is required');
        }
        
        return true;
    }
}