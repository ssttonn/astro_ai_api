import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigOptions } from 'src/common/types/custom.type';
import { ConfigService } from './services/config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(options?: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
