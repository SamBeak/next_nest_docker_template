import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";

@Injectable()
export class BasicTokenGuard implements CanActivate{
    constructor(private readonly authService: AuthService){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        
        // {authorization: 'Basic asdfasdfasdfasdf'}
        // asdfasdfasdfasdf
        const rawToken = req.headers['authorization'];
        
        if(!rawToken){
            throw new UnauthorizedException('Token not found');
        }
        
        const token = this.authService.extractTokenFromHeader(rawToken, false);
        
        const {email, password} = this.authService.decodeBasicToken(token);
        
        const user = await this.authService.authenticateWithEmailAndPassword({
            email,
            password,
        });
        
        req.user = user;
        
        return true;
    }
}