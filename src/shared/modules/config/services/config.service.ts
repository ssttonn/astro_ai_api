import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { ConfigOptions, EnvConfig } from 'src/common/types/custom.type';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(
    @Inject('CONFIG_OPTIONS') private readonly options?: ConfigOptions,
  ) {
    const filePath = `.env.${process.env.NODE_ENV || 'development'}`;
    const envFile = path.resolve(
      __dirname,
      '../../../../../',
      options?.folder || '',
      filePath,
    );
    console.log(envFile);
    this.envConfig = parse<EnvConfig>(envFile);

    console.log(this.envConfig);
  }

  get(key: keyof EnvConfig): string {
    return this.envConfig[key];
  }
}
