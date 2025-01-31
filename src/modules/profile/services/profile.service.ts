import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginMethod } from 'src/common/enums/login-method';
import { ResponseHandler } from 'src/common/response/custom.response';
import { UpdateProfileBodyDto } from '../dtos/update-profile.dto';
import { UserDatasource } from 'src/shared/datasources/user.datasource';

@Injectable()
export class ProfileService {
  constructor(private readonly userDatasource: UserDatasource) {}

  async getProfile(id: number) {
    return ResponseHandler.success(
      await this.userDatasource.find({ id }),
      HttpStatus.OK,
      'Profile fetched successfully',
    );
  }

  async updateProfile(id: number, body: UpdateProfileBodyDto) {
    return ResponseHandler.success(
      await this.userDatasource.update(
        { id },
        {
          ...body,
          updatedAt: new Date(),
        },
      ),
      HttpStatus.OK,
      'Profile updated successfully',
    );
  }

  async unlinkSocialAccount(
    id: number,
    method: Exclude<LoginMethod, LoginMethod.EMAIL>,
  ) {}
}
