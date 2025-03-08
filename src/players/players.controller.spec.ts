import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { HttpStatus } from '@nestjs/common';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  const mockPlayer = {
    id: 1,
    email: 'test@example.com',
    name: 'Juan',
    lastName: 'Perez',
    location: 'Lima',
    completedProfile: 100,
    coordinates: { type: 'Point', coordinates: [-74.006, 40.7128] },
  };

  const mockPlayerService = {
    createPlayer: jest.fn().mockResolvedValue(mockPlayer),
    findAllPlayers: jest.fn().mockResolvedValue([mockPlayer]),
    findOnePlayer: jest.fn().mockResolvedValue(mockPlayer),
    updatePlayer: jest.fn().mockResolvedValue(mockPlayer),
    removePlayer: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  describe('create', () => {
    it('should create a player successfully', async () => {
      const createPlayerDto: CreatePlayerDto = {
        email: 'test@example.com',
        name: 'Juan',
        lastName: 'Perez',
        location: 'Lima, Perú',
      };

      const result = await controller.createPlayer(createPlayerDto);

      expect(service.createPlayer).toHaveBeenCalledWith(createPlayerDto);
      expect(result).toEqual(
        createResponse(mockPlayer, 'Player created', HttpStatus.CREATED),
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of players', async () => {
      const result = await controller.findAllPLayers();

      expect(service.findAllPlayers).toHaveBeenCalled();
      expect(result).toEqual(
        createResponse([mockPlayer], 'Players found', HttpStatus.OK),
      );
    });
  });

  describe('findOne', () => {
    it('should return a player by ID', async () => {
      const result = await controller.findOnePlayer(1);

      expect(service.findOnePlayer).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        createResponse(mockPlayer, 'Player found', HttpStatus.OK),
      );
    });
  });

  describe('update', () => {
    it('should update a player successfully', async () => {
      const updatePlayerDto: UpdatePlayerDto = {
        name: 'UpdatedName',
      };

      const result = await controller.updatePlayer(1, updatePlayerDto);

      expect(service.updatePlayer).toHaveBeenCalledWith(1, updatePlayerDto);
      expect(result).toEqual(
        createResponse(mockPlayer, 'Player updated', HttpStatus.OK),
      );
    });
  });

  describe('remove', () => {
    it('should remove a player by ID', async () => {
      const result = await controller.removePlayer(1);

      expect(service.removePlayer).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        createResponse(null, 'Player deleted', HttpStatus.OK),
      );
    });
  });
});
