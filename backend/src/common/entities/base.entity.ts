import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DeleteFlag } from "../const/delete-flag.const";
import { VersionColumn } from "typeorm/browser";
export abstract class BaseModel {
	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updatedAt: Date;
	
	@Column({
		enum: Object.values(DeleteFlag),
		default: DeleteFlag.N,
	})
	delYn: DeleteFlag;

}