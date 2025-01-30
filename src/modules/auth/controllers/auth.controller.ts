import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login-body.dto';
import { LoginGoogleBodyDto } from '../dtos/login-google-body.dto';
import { RegisterBodyDto } from '../dtos/register-body.dto';
import { AuthService } from '../services/auth.service';
import { LoginFacebookBodyDto } from '../dtos/login-facebook-body.dto';
import { LoginMethod } from 'src/common/enums/login-method';
import { UppercasePipe } from 'src/shared/pipes/uppercase.pipe';
import { LoginGithubBodyDto } from '../dtos/login-github-body.dto';
import { LoginTwitterBodyDto } from '../dtos/login-twitter-body.dto';

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

  @Get(':loginMethod/request')
  requestLogin(@Param('loginMethod', UppercasePipe) loginMethod: LoginMethod) {
    switch (loginMethod) {
      case LoginMethod.GOOGLE:
        return this.authService.requestGoogleLogin();
      case LoginMethod.FACEBOOK:
        return this.authService.requestFacebookLogin();
      case LoginMethod.GITHUB:
        return this.authService.requestGithubLogin();
      case LoginMethod.TWITTER:
        return this.authService.requestTwitterLogin();
      default:
        throw new Error('Invalid login method');
    }
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

  @Post('github')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  verifyGithubLogin(@Body() body: LoginGithubBodyDto) {
    return this.authService.authWithGithub(body.accessCode);
  }

  @Post('twitter')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  verifyTwitterLogin(@Body() body: LoginTwitterBodyDto) {
    return this.authService.authWithTwitter(body.accessCode);
  }
}
