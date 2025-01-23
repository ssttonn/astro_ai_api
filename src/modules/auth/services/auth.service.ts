import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginBodyDto } from '../dtos/login-body.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppException } from 'src/common/exception/custom.exception';
import { RegisterBodyDto } from '../dtos/register-body.dto';
import * as bcrypt from 'bcrypt';
import { ResponseHandler } from 'src/common/response/custom.response';
import {
  AuthResponse,
  TokenPayload,
  UserWithoutPassword as UnsensitiveUser,
} from 'src/common/types/custom.type';
import { JwtService } from '@nestjs/jwt';
import { JsonwebtokenService } from 'src/common/jsonwebtoken/jsonwebtoken.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JsonwebtokenService,
  ) {}

  async login(loginBody: LoginBodyDto) {
    const { email, password } = loginBody;

    const existingUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new AppException(
        'User not found or email is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new AppException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const tokenPayload: TokenPayload = {
      id: existingUser.id,
    };

    return ResponseHandler.success<
      AuthResponse & { info: UnsensitiveUser<typeof existingUser> }
    >(
      {
        ...(await this.jwtService.signToken(tokenPayload)),
        info: existingUser,
      },
      HttpStatus.CREATED,
      'User created successfully',
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
        password: hashedPassword,
        firstName,
        lastName,
        username,
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
}
