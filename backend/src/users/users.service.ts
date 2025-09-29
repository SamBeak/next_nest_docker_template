import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm/browser';
import { QueryRunner } from 'typeorm/browser';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
	){}
	
	getUsersRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository(UsersModel) : this.usersRepository;
	}
	
	async getUserByEmail(email: string) {
		return this.usersRepository.findOne({
			where: {
				email,
			},
		})
	}
	
	async createUser(user: Pick<UsersModel, "email" | "password" | "name">) {
		const emailExists = await this.usersRepository.exist({
			where: {
				email: user.email,
			},
		});
		
		if (emailExists) {
			throw new Error("Email already exists");
		}
		
		const userObj = this.usersRepository.create({
			email: user.email,
			password: user.password,
			name: user.name,
		});
		
		const newUser = await this.usersRepository.save(userObj);
		
		return newUser;
	}
}
