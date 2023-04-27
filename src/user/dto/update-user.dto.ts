import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsString, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @Length(6, 16)
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  avatarPath: string;

  @IsString()
  @IsOptional()
  phone: string;
}
