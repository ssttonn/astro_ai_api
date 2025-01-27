import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UserQuery } from 'src/shared/queries/user.query';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UserQuery],
})
export class ProfileModule {}
