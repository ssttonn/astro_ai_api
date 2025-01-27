import {
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login-body.dto';
import { RegisterBodyDto } from '../dtos/register-body.dto';
import { AuthService } from '../services/auth.service';
import { IsNotEmpty } from 'class-validator';
import { LoginMethod } from 'src/common/enums/login-method';
import { LoginGoogleBodyDto } from '../dtos/login-google-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginBody: LoginBodyDto) {
    return this.authService.login(loginBody);
  }

  @Post('register')
  register(@Body() registerBody: RegisterBodyDto) {
    return this.authService.register(registerBody);
  }

  @Post('refresh')
  refreshToken(@Headers('x-refresh-token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  socialLogin(
    @Param('social') social: LoginMethod,
    @Body() body: LoginGoogleBodyDto,
  ) {
    return this.authService.authWithGoogle(body.accessCode);
  }
}
