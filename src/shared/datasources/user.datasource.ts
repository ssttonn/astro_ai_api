import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BasePrismaDataSource } from './base.datasource';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserDatasource extends BasePrismaDataSource<
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserSelect,
  UserModel
> {
  name: string = 'user';
  defaultSelect: Record<string, boolean> = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    username: true,
    avatar: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
  };
}
