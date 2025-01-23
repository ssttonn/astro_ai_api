import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginBodyDto } from './dtos/login-body.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppException } from 'src/common/exception/custom.exception';
import { RegisterBodyDto } from './dtos/register-body.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'src/common/response/custom.response';
import { UserWithoutPassword } from 'src/common/types/custom.type';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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
    });

    return Response.success<UserWithoutPassword<typeof newUser>>(
      newUser,
      HttpStatus.CREATED,
      'User created successfully',
    );
  }
}
