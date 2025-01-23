import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import 'reflect-metadata';

export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}
