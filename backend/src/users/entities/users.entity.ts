import { Column } from "typeorm/browser";
import { PrimaryGeneratedColumn } from "typeorm/browser";
import { BaseEntity } from "typeorm/browser";
import { Entity } from "typeorm/browser";

@Entity()
export class UsersModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	pkUsersIdx: number;
	
	@Column({
		unique: true,
	})
	email: string;
	
	@Column()
	password: string;
	
	@Column()
	name: string;
}