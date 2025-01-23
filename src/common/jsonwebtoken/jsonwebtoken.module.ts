import { Global, Module } from '@nestjs/common';
import { JsonwebtokenService } from './jsonwebtoken.service';

@Global()
@Module({
  providers: [JsonwebtokenService],
  exports: [JsonwebtokenService],
})
export class JsonwebtokenModule {}
