import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  password: string;

  @IsString()
  name: string;

  @IsString()
  avatarPath: string;

  @IsString()
  phone: string;
}
