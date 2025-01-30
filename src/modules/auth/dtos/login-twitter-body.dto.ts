import { IsNotEmpty } from 'class-validator';

export class LoginTwitterBodyDto {
  @IsNotEmpty()
  accessCode: string;
}
