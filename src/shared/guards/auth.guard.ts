import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JsonwebtokenService } from 'src/common/jsonwebtoken/jsonwebtoken.service';
import { AUTH_ROUTE } from 'src/common/decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jsonWebTokenService: JsonwebtokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthRoute = this.reflector.get<boolean>(
      AUTH_ROUTE,
      context.getHandler(),
    );

    if (!isAuthRoute) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.jsonWebTokenService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
