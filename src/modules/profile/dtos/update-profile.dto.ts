import { IsOptional } from 'class-validator';
import { Gender } from 'src/common/enums/gender';

export class UpdateProfileBodyDto {
  @IsOptional()
  firstName?: string;
  @IsOptional()
  lastName?: string;
  @IsOptional()
  username?: string;
  @IsOptional()
  bio?: string;
  @IsOptional()
  gender?: Gender;
  @IsOptional()
  avatar?: string;
}
