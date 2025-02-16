import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserDatasource } from 'src/shared/datasources/user.datasource';
import { LoginMethodDatasource } from 'src/shared/datasources/login-method.repository';

@Module({
  controllers: [AuthController],
  providers: [UserDatasource, AuthService, LoginMethodDatasource],
  exports: [AuthService],
})
export class AuthModule {}
