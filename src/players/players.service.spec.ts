import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './players.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import {
  HttpException,
} from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: jest.Mocked<Repository<Player>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get(getRepositoryToken(Player));
  });

  describe('findAllPlayers', () => {
    it('should return all players', async () => {
      const players = [{ id: 1 }, { id: 2 }] as Player[];
      repository.find.mockResolvedValue(players);

      const result = await service.findAllPlayers();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(players);
    });

    it('should throw HttpException on error', async () => {
      repository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAllPlayers()).rejects.toThrow(HttpException);
    });
  });

  describe('findOnePlayer', () => {
    it('should return a player if found', async () => {
      const player = { id: 1 } as Player;
      repository.findOne.mockResolvedValue(player);

      const result = await service.findOnePlayer(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(player);
    });
  });

  describe('removePlayer', () => {
    it('should delete a player successfully', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);

      await service.removePlayer(1);

      expect(repository.update).toHaveBeenCalledWith(1, {
        deletedAt: expect.any(Date),
      });
    });

    it('should throw HttpException if player not found', async () => {
      repository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.removePlayer(1)).rejects.toThrow(HttpException);
    });
  });
});
