import { Test, TestingModule } from '@nestjs/testing';
import { JsonwebtokenService } from './jsonwebtoken.service';

describe('JsonwebtokenService', () => {
  let service: JsonwebtokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonwebtokenService],
    }).compile();

    service = module.get<JsonwebtokenService>(JsonwebtokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
