import { IsNotEmpty } from 'class-validator';

export class LoginFacebookBodyDto {
  @IsNotEmpty()
  accessCode: string;
}
