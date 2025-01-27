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
        'User already exists, please login instead',
        HttpStatus.CONFLICT,
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
            firstName: given_name,
            lastName: family_name,
            avatar: picture,
            username: email.split('@')[0],
            LoginMethod: {
              create: {
                method: LoginMethod.GOOGLE,
                identifier: sub,
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

      const googleLoginMethod = user.LoginMethod.find(
        (loginMethod) => loginMethod.method === LoginMethod.GOOGLE,
      );

      if (!googleLoginMethod) {
        await this.prismaService.loginMethod.create({
          data: {
            userId: user.id,
            method: LoginMethod.GOOGLE,
            identifier: sub,
          },
        });
      }

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
}
