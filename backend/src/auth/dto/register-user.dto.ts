import { PickType } from "@nestjs/swagger";
import { UsersModel } from "src/users/entities/users.entity";

export class RegisterUserDto extends PickType(UsersModel, ["email", "password", "name"]) {}