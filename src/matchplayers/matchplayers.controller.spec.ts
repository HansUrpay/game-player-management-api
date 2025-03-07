import { Test, TestingModule } from '@nestjs/testing';
import { MatchplayersController } from './matchplayers.controller';
import { MatchplayersService } from './matchplayers.service';

describe('MatchplayersController', () => {
  let controller: MatchplayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchplayersController],
      providers: [MatchplayersService],
    }).compile();

    controller = module.get<MatchplayersController>(MatchplayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
