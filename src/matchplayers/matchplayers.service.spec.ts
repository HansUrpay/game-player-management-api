import { Test, TestingModule } from '@nestjs/testing';
import { MatchplayersService } from './matchplayers.service';

describe('MatchplayersService', () => {
  let service: MatchplayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchplayersService],
    }).compile();

    service = module.get<MatchplayersService>(MatchplayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
