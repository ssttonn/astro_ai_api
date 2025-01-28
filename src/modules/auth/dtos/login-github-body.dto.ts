import { IsNotEmpty } from 'class-validator';

export class LoginGithubBodyDto {
  @IsNotEmpty()
  accessCode: string;
}
