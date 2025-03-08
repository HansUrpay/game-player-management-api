import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { Sport } from './enums/sport.enum';
import { Match } from './entities/match.entity';

jest.mock('src/common/helpers/response.helper');

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  const mockMatchesService = {
    createMatch: jest.fn(),
    findAllMatches: jest.fn().mockResolvedValue([
      {
        id: 1,
        sport: 'tennis',
        winingTeam: null,
        scoreTeam1: null,
        scoreTeam2: null,
        deletedAt: null,
        matchPlayers: [
          {
            id: 1,
            result: null,
            teamNumber: 1,
            player: { id: 1, name: 'Miguel', lastName: 'Paredes' },
          },
          {
            id: 2,
            result: null,
            teamNumber: 2,
            player: { id: 2, name: 'Jose', lastName: 'Paredes' },
          },
        ],
      },
    ]),
    findOneMatch: jest.fn().mockResolvedValue({
      id: 1,
      sport: 'tennis',
      winingTeam: '1',
      scoreTeam1: 5,
      scoreTeam2: 2,
      matchPlayers: [
        {
          id: 1,
          result: 'Win',
          teamNumber: 1,
          player: {
            id: 1,
            name: 'Pedro',
            lastName: 'Perez',
          },
        },
        {
          id: 2,
          result: 'Loss',
          teamNumber: 2,
          player: {
            id: 2,
            name: 'Pedro',
            lastName: 'Perez',
          },
        },
      ],
    }),
    updateMatch: jest.fn(),
    removeMatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [{ provide: MatchesService, useValue: mockMatchesService }],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);

    // jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create a match and return a response', async () => {
      const createMatchDto: CreateMatchDto = { sport: Sport.TENNIS };
      const matchResponse = { id: 1, status: 'Match created' };

      mockMatchesService.createMatch.mockResolvedValue(matchResponse);
      (createResponse as jest.Mock).mockReturnValue({
        message: 'Match created',
        data: matchResponse,
      });

      const result = await controller.createMatch(1, createMatchDto);

      expect(service.createMatch).toHaveBeenCalledWith(1, createMatchDto);
      expect(createResponse).toHaveBeenCalledWith(
        matchResponse,
        'Match created',
        201,
      );
      expect(result).toEqual({ message: 'Match created', data: matchResponse });
    });
  });

  describe('findAllMatches', () => {
    it('Should return matches with correct matchPlayers length and sport name', async () => {
      const matches = [
        {
          id: 1,
          sport: 'tennis',
          winingTeam: null,
          scoreTeam1: null,
          scoreTeam2: null,
          deletedAt: null,
          matchPlayers: [
            {
              id: 1,
              result: null,
              teamNumber: 1,
              player: { id: 1, name: 'Miguel', lastName: 'Paredes' },
            },
            {
              id: 2,
              result: null,
              teamNumber: 2,
              player: { id: 2, name: 'Jose', lastName: 'Paredes' },
            },
          ],
        },
      ] as Match[];

      jest.spyOn(service, 'findAllMatches').mockResolvedValueOnce(matches);

      (createResponse as jest.Mock).mockReturnValue({
        statusCode: 200,
        message: 'Matches found',
        success: true,
        data: matches,
      });

      const result = await controller.findAllMatches();

      expect(service.findAllMatches).toHaveBeenCalled();

      expect(createResponse).toHaveBeenCalledWith(
        matches,
        'Matches found',
        200,
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Matches found',
        success: true,
        data: matches,
      });

      expect(result.data[0].sport).toBe('tennis');
      expect(result.data[0].matchPlayers.length).toBe(2);
    });
  });

  describe('findOneMatch', () => {
    it('Should return a single match successfully', async () => {
      const matchId = 1;
      const expectedMatch = {
        id: 1,
        sport: 'tennis',
        winingTeam: '1',
        scoreTeam1: 5,
        scoreTeam2: 2,
        matchPlayers: [
          {
            id: 1,
            result: 'Win',
            teamNumber: 1,
            player: {
              id: 1,
              name: 'Pedro',
              lastName: 'Perez',
            },
          },
          {
            id: 2,
            result: 'Loss',
            teamNumber: 2,
            player: {
              id: 2,
              name: 'Pedro',
              lastName: 'Perez',
            },
          },
        ],
      } as Match;

      jest.spyOn(service, 'findOneMatch').mockResolvedValueOnce(expectedMatch);

      (createResponse as jest.Mock).mockReturnValue({
        statusCode: 200,
        message: 'Match found',
        success: true,
        data: expectedMatch,
      });

      const result = await controller.findOneMatch(matchId);

      expect(service.findOneMatch).toHaveBeenCalledWith(matchId);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Match found',
        success: true,
        data: expectedMatch,
      });
      expect(result.data).toEqual(expectedMatch);
    });
  });

  describe('updateMatch', () => {
    it('Should update a match and return a response', async () => {
      const updateMatchDto = { winingTeam: '1', scoreTeam1: 6, scoreTeam2: 1 };

      const updatedMatch = {
        id: 2,
        sport: 'tennis',
        winingTeam: '1',
        scoreTeam1: 6,
        scoreTeam2: 1,
        matchPlayers: [
          {
            id: 3,
            result: 'Win',
            teamNumber: 1,
            player: { id: 2, name: 'John', lastName: 'Doe' },
          },
          {
            id: 4,
            result: 'Loss',
            teamNumber: 2,
            player: { id: 1, name: 'Pedro', lastName: 'Perez' },
          },
        ],
      } as Match;

      jest.spyOn(service, 'updateMatch').mockResolvedValueOnce(updatedMatch);

      (createResponse as jest.Mock).mockReturnValue({
        statusCode: 200,
        message: 'Match updated',
        success: true,
        data: updatedMatch,
      });

      const result = await controller.updateMatch(2, updateMatchDto);

      expect(service.updateMatch).toHaveBeenCalledWith(2, updateMatchDto);

      expect(createResponse).toHaveBeenCalledWith(
        updatedMatch,
        'Match updated',
        200,
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Match updated',
        success: true,
        data: updatedMatch,
      });

      expect(result.data.sport).toBe('tennis');
      expect(result.data.winingTeam).toBe('1');
      expect(result.data.matchPlayers.length).toBe(2);
    });
  });

  describe('remove', () => {
    it('Should delete a match', async () => {
      const matchId = 1;
      const deleteResult = null;

      const service = jest
        .spyOn(mockMatchesService, 'removeMatch')
        .mockResolvedValueOnce(deleteResult);

      (createResponse as jest.Mock).mockReturnValue({
        statusCode: 200,
        message: 'Match deleted',
        success: true,
        data: deleteResult,
      });

      const result = await controller.removeMatch(matchId);

      expect(service).toHaveBeenCalledWith(matchId);
      expect(createResponse).toHaveBeenCalledWith(
        deleteResult,
        'Match deleted',
        200,
      );
      expect(result).toEqual({
        statusCode: 200,
        message: 'Match deleted',
        success: true,
        data: deleteResult,
      });
    });
  });
});
