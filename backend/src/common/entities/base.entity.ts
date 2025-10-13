import { Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { YnEnum } from "../const/yn.const";

export abstract class BaseEntity {
	// 생성 로그
	@CreateDateColumn()
	createdAt: Date;
	@Column({
		type: "varchar",
		length: 50,
	})
	createdId: string;
	@Column({
		type: "varchar",
		length: 50,
	})
	createdIp: string;
	
	// 수정 로그
	@UpdateDateColumn()
	updatedAt: Date;
	@Column({
		type: "varchar",
		length: 50,
	})
	updatedId: string;
	@Column({
		type: "varchar",
		length: 50,
	})
	updatedIp: string;
	
	// 삭제 여부
	@Column({
		enum: Object.values(YnEnum),
		default: YnEnum.N,
	})
	delYn: YnEnum;
}