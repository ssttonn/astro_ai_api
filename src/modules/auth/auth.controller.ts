import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto as LoginBodyDto } from './dtos/login-body.dto';
import { RegisterBodyDto } from './dtos/register-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginBody: LoginBodyDto) {
    return this.authService.login(loginBody);
  }

  @Post('register')
  register(@Body() registerBody: RegisterBodyDto) {
    return this.authService.register(registerBody);
  }
}
