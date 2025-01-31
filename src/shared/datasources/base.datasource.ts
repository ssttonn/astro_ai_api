import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BaseModel } from 'src/common/types/model.type';
import {
  PrismaDataSourceContract,
  ClientTransaction,
} from 'src/common/types/prisma-datasource.type';

@Injectable()
export abstract class BasePrismaDataSource<
  Create,
  Update,
  Where,
  Select,
  Model extends BaseModel,
> implements PrismaDataSourceContract
{
  constructor(protected readonly client: PrismaService) {}
  name: string;
  defaultSelect: Record<string, boolean>;

  joinTransaction(client: ClientTransaction): Omit<this, 'joinTransaction'> {
    const thisRepo = this.constructor as new (
      ...args: unknown[]
    ) => typeof this;
    const cls = new (class extends thisRepo {})(client);
    return cls as typeof this;
  }

  private mergeSelect(select?: Select) {
    return {
      ...this.defaultSelect,
      ...select,
    };
  }

  find(where: Where, select?: Select): Promise<Model | undefined> {
    return this.client[this.name].findFirst({
      where,
      select: this.mergeSelect(select),
    });
  }

  create(data: Create): Promise<Model> {
    return this.client[this.name].create({
      data,
      select: this.defaultSelect,
    });
  }

  update(where: Where, data: Update): Promise<Model> {
    return this.client[this.name].update({
      where,
      data,
      select: this.defaultSelect,
    });
  }

  delete(where: Where): Promise<Model> {
    return this.client[this.name].delete({
      where,
      select: this.defaultSelect,
    });
  }

  count(where: Where): Promise<number> {
    return this.client[this.name].count({
      where,
    });
  }

  findMany(where: Where, select?: Select): Promise<Model[]> {
    return this.client[this.name].findMany({
      where,
      select: this.mergeSelect(select),
    });
  }

  findManyWithPagination(
    where: Where,
    select?: Select,
    skip?: number,
    take?: number,
  ): Promise<Model[]> {
    return this.client[this.name].findMany({
      where,
      select: this.mergeSelect(select),
      skip,
      take,
    });
  }
}
