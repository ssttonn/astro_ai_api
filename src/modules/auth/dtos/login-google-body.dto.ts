import { IsNotEmpty } from 'class-validator';

export class LoginGoogleBodyDto {
  @IsNotEmpty()
  accessCode: string;
}
