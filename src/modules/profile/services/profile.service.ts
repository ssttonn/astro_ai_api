import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ResponseHandler } from 'src/common/response/custom.response';
import { UserQuery } from 'src/shared/queries/user.query';

@Injectable()
export class ProfileService {
  constructor(private readonly userQuery: UserQuery) {}

  async getProfile(id: number) {
    return ResponseHandler.success(
      await this.userQuery.find({ id }),
      HttpStatus.OK,
      'Profile fetched successfully',
    );
  }
}
