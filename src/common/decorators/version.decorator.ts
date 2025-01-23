import { Reflector } from '@nestjs/core';

export const ClientVersion = Reflector.createDecorator<string | string[]>();
export const HigherVersion = Reflector.createDecorator<string>();
export const LowerVersion = Reflector.createDecorator<string>();
