import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UserDatasource } from 'src/shared/datasources/user.datasource';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UserDatasource],
})
export class ProfileModule {}
