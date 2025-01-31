import { BaseModel } from 'src/common/types/model.type';

export interface UserModel extends BaseModel {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}
