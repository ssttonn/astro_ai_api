import { LoginMethod } from 'src/common/enums/login-method';
import { BaseModel } from 'src/common/types/model.type';
import { UserModel } from './user.model';

export interface LoginMethodModel extends BaseModel {
  userId: number;
  method: LoginMethod;
  identifier: string;
  email: string;
  User: UserModel;
}
