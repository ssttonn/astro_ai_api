import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BasePrismaDataSource } from './base.datasource';
import { LoginMethodModel } from '../models/login-method.model';

@Injectable()
export class LoginMethodDatasource extends BasePrismaDataSource<
  Prisma.LoginMethodCreateInput,
  Prisma.LoginMethodUpdateInput,
  Prisma.LoginMethodWhereInput,
  Prisma.LoginMethodSelect,
  LoginMethodModel
> {
  name = 'loginMethod';

  defaultSelect: Record<string, boolean> = {
    id: true,
    identifier: true,
    method: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };
}
