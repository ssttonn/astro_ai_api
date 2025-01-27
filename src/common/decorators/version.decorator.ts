import { Reflector } from '@nestjs/core';

export const ClientVersion = Reflector.createDecorator<string | string[]>();
export const FromVersion = Reflector.createDecorator<string>();
export const ToVersion = Reflector.createDecorator<string>();
