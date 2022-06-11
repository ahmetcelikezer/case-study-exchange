import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
