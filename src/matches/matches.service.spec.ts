import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchPlayer } from 'src/matchplayers/entities/matchplayer.entity';
import { Player } from 'src/players/entities/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockMatchRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([{ id: 1, status: 'Match created' }]),
  })),
});

const mockMatchPlayerRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
});

const mockPlayerRepository = () => ({
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
  save: jest.fn(),
});

describe('MatchesService', () => {
  let service: MatchesService;
  let matchRepository: Repository<Match>;
  let matchPlayersRepository: Repository<MatchPlayer>;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useFactory: mockMatchRepository },
        {
          provide: getRepositoryToken(MatchPlayer),
          useFactory: mockMatchPlayerRepository,
        },
        {
          provide: getRepositoryToken(Player),
          useFactory: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    matchPlayersRepository = module.get<Repository<MatchPlayer>>(
      getRepositoryToken(MatchPlayer),
    );
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllMatches', () => {
    it('Should return all matches successfully', async () => {
      jest.spyOn(matchRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          { id: 1, sport: 'tennis', matchPlayers: [] },
          { id: 2, sport: 'football', matchPlayers: [] },
        ]),
      } as any);

      const result = await service.findAllMatches();

      expect(result).toEqual([
        expect.objectContaining({ id: 1, sport: 'tennis' }),
        expect.objectContaining({ id: 2, sport: 'football' }),
      ]);
    });
  });

  describe('findOneMatch', () => {
    it(' Should return a specific match if found', async () => {
      jest.spyOn(matchRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOneOrFail: jest.fn().mockResolvedValue({
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
      } as any);

      const expectedMatch = {
        id: 1,
        sport: 'tennis',
        winingTeam: '1',
        scoreTeam1: 5,
        scoreTeam2: 2,
        matchPlayers: [
          expect.objectContaining({
            id: 1,
            result: 'Win',
            teamNumber: 1,
            player: expect.objectContaining({
              id: 1,
              name: 'Pedro',
              lastName: 'Perez',
            }),
          }),
          expect.objectContaining({
            id: 2,
            result: 'Loss',
            teamNumber: 2,
            player: expect.objectContaining({
              id: 2,
              name: 'Pedro',
              lastName: 'Perez',
            }),
          }),
        ],
      };

      const result = await service.findOneMatch(1);

      expect(result).toEqual(expectedMatch);
    });
  });
});
