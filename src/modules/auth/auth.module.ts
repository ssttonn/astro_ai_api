import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserQuery } from 'src/shared/queries/user.query';
import { LoginMethodQuery } from 'src/shared/queries/login-method.query';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserQuery, LoginMethodQuery],
  exports: [AuthService],
})
export class AuthModule {}
