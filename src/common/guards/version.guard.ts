import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  ClientVersion,
  HigherVersion,
  LowerVersion,
} from '../decorators/version.decorator';

@Injectable()
export class SpecificVersionGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const versions: string | string[] = this.reflector.get<string | string[]>(
      ClientVersion,
      context.getHandler(),
    );
    if (!versions) {
      return true;
    }

    if (Array.isArray(versions)) {
      return versions.some((version) => this.matchVersion(version, context));
    }

    return this.matchVersion(versions, context);
  }

  private matchVersion(version: string, context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    return request.headers['x-version'] === version;
  }
}

@Injectable()
export class HigherVersionGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const version: string = this.reflector.get<string>(
      HigherVersion,
      context.getHandler(),
    );
    if (!version) {
      return true;
    }

    const versionInt = parseInt(version.replaceAll('.', ''), 10);
    const request: Request = context.switchToHttp().getRequest();
    const clientVersion: string = request.headers['x-version'] as string;

    if (!clientVersion) {
      return false;
    }

    const clientVersionInt = parseInt(clientVersion.replaceAll('.', ''), 10);

    return clientVersionInt >= versionInt;
  }
}

@Injectable()
export class LowerVersionGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const version: string = this.reflector.get<string>(
      LowerVersion,
      context.getHandler(),
    );
    if (!version) {
      return true;
    }

    const versionInt = parseInt(version.replaceAll('.', ''), 10);
    const request: Request = context.switchToHttp().getRequest();
    const clientVersion: string = request.headers['x-version'] as string;

    if (!clientVersion) {
      return false;
    }

    const clientVersionInt = parseInt(clientVersion.replaceAll('.', ''), 10);

    return clientVersionInt <= versionInt;
  }
}
