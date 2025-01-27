import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserQuery {
  constructor(private readonly prismaService: PrismaService) {}

  async find(where: Prisma.UserWhereInput, select?: Prisma.UserSelect) {
    return this.prismaService.user.findFirst({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        ...select,
      },
    });
  }
}
