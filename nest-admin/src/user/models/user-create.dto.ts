import { IsEmail, IsNotEmpty } from "class-validator";

export class UserCreateDto {
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // tslint:disable-next-line: variable-name
  role_id: number;
}