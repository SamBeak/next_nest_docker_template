import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}
	
	// Header로부터 Token 추출
	extractTokenFromHeader(header: string, isBearer: boolean) {
		const splitToken = header.split(" ");
		const prefix = isBearer ? "Bearer" : "Basic";
		
		if (splitToken.length !== 2 || splitToken[0] !== prefix) {
			throw new UnauthorizedException("Invalid token");
		}
		
		const token = splitToken[1];
		
		return token;
	}
	
	// Basic Auth
	decodeBasicToken(base64String: string) {
		const decoded = Buffer.from(base64String, "base64").toString("utf8");
		
		const split = decoded.split(":");
		
		if (split.length !== 2) {
			throw new UnauthorizedException("Invalid token");
		}
		
		const email = split[0];
		const password = split[1];
		
		return { email, password };
	}
	
	// 토큰 검증
	verifyToken(token: string) {
		try {
			return this.jwtService.verify(token, {
				secret: this.configService.get<string>("ENV_JWT_SECRET_KEY"),
			});
		}
		catch(e) {
			throw new UnauthorizedException("Invalid token");
		}
	}
	
	// Token 재발급
	rotateToken(token: string, isRefreshToken: boolean) {
		const decoded = this.jwtService.verify(token, {
			secret: this.configService.get<string>("ENV_JWT_SECRET_KEY"),
			complete: true,
		});
		
		if (decoded.type !== "refresh") {
			throw new UnauthorizedException("Refresh token is required");
		}
		return true;
		// return this.signToken({
		// 	...decoded,
		// }, isRefreshToken);
	}
	
	// Token 생성
	// signToken(user: Pick<UsersModel, "email" | "id">, isRefreshToken: boolean) {
	// 	const payload = {
	// 		email: user.email,
	// 		sub: user.id,
	// 		type: isRefreshToken ? "refresh" : "access",
	// 	}
		
	// 	return this.jwtService.sign(payload, {
	// 		secret: this.configService.get<string>("ENV_JWT_SECRET_KEY"),
	// 		expiresIn: isRefreshToken ? 3600 : 300,
	// 	});
	// }
}
