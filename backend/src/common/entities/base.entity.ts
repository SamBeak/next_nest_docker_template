import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum DeleteFlag {
	Y = "Y",
	N = "N",
}

export abstract class BaseModel {
	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updatedAt: Date;
	
	@Column({
		enum: DeleteFlag,
		default: DeleteFlag.N,
	})
	delYn: DeleteFlag;

}