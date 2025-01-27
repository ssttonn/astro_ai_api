import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const AUTH_ROUTE = 'auth-route';

export const AuthenticationRequired = () => SetMetadata(AUTH_ROUTE, true);
