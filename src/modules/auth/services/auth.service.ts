import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/common/exception/custom.exception';
import { JsonwebtokenService } from 'src/common/jsonwebtoken/jsonwebtoken.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ResponseHandler } from 'src/common/response/custom.response';
import {
  AuthResponse,
  TokenPayload,
  UserWithoutPassword as UnsensitiveUser,
} from 'src/common/types/custom.type';
import { LoginBodyDto } from '../dtos/login-body.dto';
import { RegisterBodyDto } from '../dtos/register-body.dto';
import { UserQuery } from 'src/shared/queries/user.query';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { LoginMethodQuery } from 'src/shared/queries/login-method.query';
import { LoginMethod } from 'src/common/enums/login-method';
import { LoginMethodType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userQuery: UserQuery,
    private readonly loginMethodQuery: LoginMethodQuery,
    private readonly jwtService: JsonwebtokenService,
    private readonly httpService: HttpService,
  ) {}

  async login(loginBody: LoginBodyDto) {
    const { email, password } = loginBody;

    const existingLoginMethod = await this.loginMethodQuery.find(
      {
        email,
        method: LoginMethod.EMAIL,
      },
      {
        User: true,
      },
    );

    if (!existingLoginMethod) {
      throw new AppException(
        'User not found or email is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingLoginMethod.identifier,
    );

    if (!isPasswordValid) {
      throw new AppException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const tokenPayload: TokenPayload = {
      id: existingLoginMethod.User.id,
    };

    return ResponseHandler.success<
      AuthResponse & { info: UnsensitiveUser<typeof existingLoginMethod.User> }
    >(
      {
        ...(await this.jwtService.signToken(tokenPayload)),
        info: existingLoginMethod.User,
      },
      HttpStatus.OK,
      'Login successfully',
    );
  }

  async register(registerBody: RegisterBodyDto) {
    const { email, password, firstName, lastName, username } = registerBody;

    const existingUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new AppException(
        undefined,
        HttpStatus.CONFLICT,
        'User already exists, please login instead',
      );
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        username,
        LoginMethod: {
          create: {
            method: 'EMAIL',
            identifier: hashedPassword,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });

    const tokenPayload: TokenPayload = {
      id: newUser.id,
    };

    return ResponseHandler.success<
      AuthResponse & { info: UnsensitiveUser<typeof newUser> }
    >(
      {
        ...(await this.jwtService.signToken(tokenPayload)),
        info: newUser,
      },
      HttpStatus.CREATED,
      'User created successfully',
    );
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new AppException(
        undefined,
        HttpStatus.BAD_REQUEST,
        'Refresh token is required',
      );
    }

    let tokenPayload = await this.jwtService.verifyToken(refreshToken);

    if (!tokenPayload) {
      throw new AppException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userQuery.find({ id: tokenPayload.id });

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    tokenPayload = {
      id: user.id,
    };

    return ResponseHandler.success<
      AuthResponse & { info: UnsensitiveUser<typeof user> }
    >(
      {
        ...(await this.jwtService.signToken(tokenPayload)),
        info: user,
      },
      HttpStatus.CREATED,
      'Token refreshed successfully',
    );
  }

  requestGoogleLogin() {
    return ResponseHandler.success<Record<string, string>>(
      {
        url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`,
      },
      HttpStatus.OK,
      'Google login request successful',
    );
  }

  requestFacebookLogin() {
    return ResponseHandler.success<Record<string, string>>(
      {
        url: `https://www.facebook.com/v22.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&response_type=code&scope=email,public_profile`,
      },
      HttpStatus.OK,
      'Facebook login request successful',
    );
  }

  requestGithubLogin() {
    return ResponseHandler.success<Record<string, string>>(
      {
        url: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`,
      },
      HttpStatus.OK,
      'Github login request successful',
    );
  }

  async authWithGoogle(accessCode: string) {
    // Google login logic
    try {
      const tokenResponse = await this.httpService.axiosRef.post(
        'https://oauth2.googleapis.com/token',
        {
          code: accessCode,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
      );

      const { id_token } = tokenResponse.data;

      const tokenInfo = await this.httpService.axiosRef.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`,
      );

      const { email, sub, given_name, family_name, picture } = tokenInfo.data;

      const user = await this.authUser(LoginMethod.GOOGLE, {
        email,
        identifier: sub,
        firstName: given_name,
        lastName: family_name,
        avatarUrl: picture,
      });

      const tokenPayload: TokenPayload = {
        id: user.id,
      };

      delete user.LoginMethod;

      return ResponseHandler.success<
        AuthResponse & {
          info: UnsensitiveUser<typeof user>;
        }
      >(
        {
          ...(await this.jwtService.signToken(tokenPayload)),
          info: user,
        },
        HttpStatus.OK,
        'Login successfully',
      );
    } catch (error) {
      let errorResponse = error;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof AxiosError) {
        errorResponse = error.response?.data ?? errorResponse;
        statusCode = error.status ?? statusCode;
      }
      throw new AppException(
        errorResponse,
        statusCode,
        'Failed to authenticate with Google',
      );
    }
  }

  async authWithFacebook(accessCode: string) {
    // Facebook login logic
    try {
      const tokenResponse = await this.httpService.axiosRef.get(
        `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${accessCode}`,
      );

      const { access_token } = tokenResponse.data;

      const userInfo = await this.httpService.axiosRef.get(
        `https://graph.facebook.com/v22.0/me?fields=id,email,first_name,last_name,picture&access_token=${access_token}`,
      );

      const { email, id, first_name, last_name, picture } = userInfo.data;

      const user = await this.authUser(LoginMethod.FACEBOOK, {
        email,
        identifier: id,
        firstName: first_name,
        lastName: last_name,
        avatarUrl: picture.data.url,
      });

      const tokenPayload: TokenPayload = {
        id: user.id,
      };

      delete user.LoginMethod;

      return ResponseHandler.success<
        AuthResponse & {
          info: UnsensitiveUser<typeof user>;
        }
      >(
        {
          ...(await this.jwtService.signToken(tokenPayload)),
          info: user,
        },
        HttpStatus.OK,
        'Login successfully',
      );
    } catch (error) {
      let errorResponse = error;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof AxiosError) {
        errorResponse = error.response?.data ?? errorResponse;
        statusCode = error.status ?? statusCode;
      }
      throw new AppException(
        errorResponse,
        statusCode,
        'Failed to authenticate with Facebook',
      );
    }
  }

  async authWithGithub(accessCode: string) {
    try {
      const tokenResponse = await this.httpService.axiosRef.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: accessCode,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const { access_token } = tokenResponse.data;

      const [userInfoResponse, emailListResponse] = await Promise.all([
        this.httpService.axiosRef.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
        this.httpService.axiosRef.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
      ]);

      const userInfo = userInfoResponse.data;

      const primaryEmail = emailListResponse.data.find(
        (email: { primary: boolean }) => email.primary,
      ).email;

      const { id, avatar_url, login, name } = userInfo;

      const user = await this.authUser(LoginMethod.GITHUB, {
        email: primaryEmail,
        firstName: name,
        lastName: name,
        identifier: id.toString(),
        avatarUrl: avatar_url,
        username: login,
      });

      const tokenPayload: TokenPayload = {
        id: user.id,
      };

      delete user.LoginMethod;

      return ResponseHandler.success<
        AuthResponse & {
          info: UnsensitiveUser<typeof user>;
        }
      >(
        {
          ...(await this.jwtService.signToken(tokenPayload)),
          info: user,
        },
        HttpStatus.OK,
        'Login successfully',
      );
    } catch (error) {
      let errorResponse = error;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof AxiosError) {
        errorResponse = error.response?.data ?? errorResponse;
        statusCode = error.status ?? statusCode;
      }
      throw new AppException(
        errorResponse,
        statusCode,
        'Failed to authenticate with Github',
      );
    }
  }

  private async authUser(
    method: LoginMethod,
    userData: {
      email: string;
      identifier: string;
      firstName: string;
      lastName: string;
      username?: string;
      avatarUrl: string | undefined;
    },
  ) {
    const { email, identifier, firstName, lastName, avatarUrl, username } =
      userData;
    let user: any = await this.userQuery.find(
      {
        email,
      },
      {
        LoginMethod: true,
      },
    );

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
          avatar: avatarUrl,
          username: username || email.split('@')[0],
          LoginMethod: {
            create: {
              method: method as LoginMethodType,
              identifier,
            },
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
          bio: true,
        },
      });
    }

    const loginMethod = user.LoginMethod.find(
      (loginMethod) => loginMethod.method === method,
    );

    if (!loginMethod) {
      await this.prismaService.loginMethod.create({
        data: {
          userId: user.id,
          method: method as LoginMethodType,
          identifier,
          email,
        },
      });
    }
    return user;
  }
}
