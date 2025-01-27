import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class LoginMethodQuery {
  constructor(private readonly prismaService: PrismaService) {}

  async find(
    where: Prisma.LoginMethodWhereInput,
    select?: Prisma.LoginMethodSelect,
  ) {
    return this.prismaService.loginMethod.findFirst({
      where,
      select: {
        id: true,
        identifier: true,
        method: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        ...select,
      },
    });
  }
}
