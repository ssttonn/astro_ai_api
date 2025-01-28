import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login-body.dto';
import { LoginGoogleBodyDto } from '../dtos/login-google-body.dto';
import { RegisterBodyDto } from '../dtos/register-body.dto';
import { AuthService } from '../services/auth.service';
import { LoginFacebookBodyDto } from '../dtos/login-facebook-body.dto';

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

  @Get('google/request')
  requestGoogleLogin() {
    return this.authService.requestGoogleLogin();
  }

  @Get('facebook/request')
  requestFacebookLogin() {
    return this.authService.requestFacebookLogin();
  }

  @Post('google')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  verifyGoogleLogin(@Body() body: LoginGoogleBodyDto) {
    return this.authService.authWithGoogle(body.accessCode);
  }

  @Post('facebook')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  verifyFacebookLogin(@Body() body: LoginFacebookBodyDto) {
    return this.authService.authWithFacebook(body.accessCode);
  }
}
