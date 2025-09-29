import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_SECRET } from 'src/common/const/env-keys.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
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
				secret: this.configService.get<string>(JWT_SECRET),
			});
		}
		catch(e) {
			throw new UnauthorizedException("Invalid token");
		}
	}
	
	// Token 재발급
	rotateToken(token: string, isRefreshToken: boolean) {
		const decoded = this.jwtService.verify(token, {
			secret: this.configService.get<string>(JWT_SECRET),
			complete: true,
		});
		
		if (decoded.type !== "refresh") {
			throw new UnauthorizedException("Refresh token is required");
		}
		return this.signToken({
			...decoded,
		}, isRefreshToken);
	}
	
	// Token 생성
	signToken(user: Pick<UsersModel, "email" | "pkUsersIdx">, isRefreshToken: boolean) {
		const payload = {
			email: user.email,
			sub: user.pkUsersIdx,
			type: isRefreshToken ? "refresh" : "access",
		}
		
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>(JWT_SECRET),
			expiresIn: isRefreshToken ? this.configService.get<string>(JWT_REFRESH_EXPIRES_IN) : this.configService.get<string>(JWT_EXPIRES_IN),
		});
	}
	
	loginUser(user:Pick<UsersModel, "email" | "pkUsersIdx">) {
		const accessToken = this.signToken(user, false);
		const refreshToken = this.signToken(user, true);
		
		return {
			accessToken,
			refreshToken,
		}
	}
	
	async authenticateWithEmailAndPassword(user: Pick<UsersModel, "email" | "password">) {
		const existingUser = await this.usersService.getUserByEmail(user.email);
		
		if (!existingUser) {
			throw new UnauthorizedException("Invalid credentials");
		}
		
		const passOk = await bcrypt.compare(user.password, existingUser.password);
		if (!passOk) {
			throw new UnauthorizedException("Invalid credentials");
		}
		
		return existingUser;
	}
	
	async loginWithEmail(user: Pick<UsersModel, "email" | "password">) {
		const existingUser = await this.authenticateWithEmailAndPassword(user);
		
		return this.loginUser(existingUser);
	}
	
	async registerWithEmail(user: RegisterUserDto) {
		const hash = await bcrypt.hash(
			user.password,
			this.configService.get<number>(BCRYPT_SALT_ROUNDS),
		);
		
		const newUser = await this.usersService.createUser({
			...user,
			password: hash,
		});
		
		return this.loginUser(newUser);
	}
}
