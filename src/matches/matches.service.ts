import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { MatchPlayer } from 'src/matchplayers/entities/matchplayer.entity';
import { Player } from 'src/players/entities/player.entity';
import { MatchResult } from 'src/matchplayers/enums/match-result.enum';
import { MatchWinner } from './enums/match-winner.enum';
import { Sport } from './enums/sport.enum';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(MatchPlayer)
    private matchPlayersRepository: Repository<MatchPlayer>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async createMatch(playerId: number, createMatchDto: CreateMatchDto) {
    try {
      // Buscar jugador anfitrion en la base de datos
      const hostPlayer = await this.playerRepository.findOne({
        where: { id: playerId },
      });
      if (!hostPlayer) throw new NotFoundException('Player not found');

      // Validar si el jugador tiene la ubicación actulizada en su perfil
      if (!hostPlayer.location) {
        throw new InternalServerErrorException(
          'Player location not updated, please update your profile',
        );
      }

      const { sport } = createMatchDto;
      const playersNeeded = this.getPlayersNeeded(sport);

      // Obtener jugadores compatibles al anfitrion
      const compatiblePlayers = await this.getCompatiblePlayers(
        hostPlayer,
        playersNeeded,
      );

      // Verificar si se completaron los jugadores para crear el juego y asignar equipos
      if (compatiblePlayers.length + 1 >= playersNeeded) {
        const match = await this.assignPlayersToMatch(
          hostPlayer,
          compatiblePlayers,
          sport,
        );

        return { status: 'Match found', match };
      } else {
        // Si no se completaron los jugadores, poner al anfitrion en espera e indicar los jugadores restantes
        return {
          status: 'Waiting for players',
          playersMissing: playersNeeded - (compatiblePlayers.length + 1),
          availablePlayers: compatiblePlayers.length + 1,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating match: ${error.message}`,
      );
    }
  }

  async findAllMatches() {
    try {
      return await this.buildMatchQuery().getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching matches: ${error.message} `,
      );
    }
  }

  async findOneMatch(id: number) {
    try {
      return await this.buildMatchQuery()
        .where('match.id = :id', { id })
        .getOneOrFail();
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Match not found');
      }

      throw new InternalServerErrorException(
        `Error fetching match: ${error.message}`,
      );
    }
  }

  /**
   * Guardar el resultado del partido, actualizar los partidos por jugador y el ranking de cada uno
   * @param matchId - Id del partido
   * @param updateMatchDto - Resultado del partido
   */
  async updateMatch(matchId: number, updateMatchDto: UpdateMatchDto) {
    // Buscar el partido por id
    const matchFound = await this.findOneMatch(matchId);

    try {
      // Actualizar el partido con el resultado final
      const { scoreTeam1, scoreTeam2 } = updateMatchDto;
      matchFound.scoreTeam1 = scoreTeam1;
      matchFound.scoreTeam2 = scoreTeam2;
      matchFound.winingTeam =
        scoreTeam1 > scoreTeam2
          ? MatchWinner.HOME
          : scoreTeam1 < scoreTeam2
            ? MatchWinner.AWAY
            : MatchWinner.DRAW;
      await this.matchRepository.save(matchFound);

      // Actualizar el resultado del partido por cada jugador
      for (const matchPlayer of matchFound.matchPlayers) {
        if (matchFound.winingTeam === MatchWinner.DRAW) {
          matchPlayer.result = MatchResult.DRAW;
        } else {
          matchPlayer.result =
            matchPlayer.teamNumber ===
            parseInt(matchFound.winingTeam.toString())
              ? MatchResult.WIN
              : MatchResult.LOSS;
        }
      }
      await this.matchPlayersRepository.save(matchFound.matchPlayers);

      // Actualizar el ranking de los jugadores
      await this.updateRankingOfPlayer(matchId);

      return matchFound;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating match: ${error.message}`,
      );
    }
  }

  async removeMatch(id: number) {
    try {
      const matchFound = await this.findOneMatch(id);
      if (!matchFound) throw new NotFoundException('Match not found');
      await this.matchRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing match: ${error.message}`,
      );
    }
  }

  private async calculateRanking(player: Player) {
    // Obtener los partidos de un jugador
    const playerMatches = await this.matchPlayersRepository.find({
      where: { player: { id: player.id } },
      relations: ['player', 'match'],
    });

    const totalMatches = playerMatches.length;
    if (totalMatches === 0) return 0;

    // Contabilizar victorias y derrotas
    const totalWins = playerMatches.filter(
      (match) => match.result === MatchResult.WIN,
    ).length;
    const totalLosses = playerMatches.filter(
      (match) => match.result === MatchResult.LOSS,
    ).length;

    // Calcular el bonus por experiencia
    let experienceBonus = 0;
    if (totalMatches > 0 && totalMatches <= 5) experienceBonus = 5;
    else if (totalMatches > 5 && totalMatches <= 10) experienceBonus = 10;
    else if (totalMatches > 10) experienceBonus = 15;

    // Calcular el ranking basado en todos los partidos jugados
    let newRanking =
      Math.max(totalWins * 10 - totalLosses * 5, 0) + experienceBonus;

    return newRanking;
  }

  async updateRankingOfPlayer(matchId: number) {
    // Buscar todos los jugadores de un partido
    const matchPlayers = await this.matchPlayersRepository.find({
      where: {
        match: { id: matchId },
      },
      relations: ['player'],
    });

    // Actualizar el ranking de cada jugador
    for (const matchPlayer of matchPlayers) {
      matchPlayer.player.ranking = await this.calculateRanking(
        matchPlayer.player,
      );
    }

    // Guardar los jugadores con su ranking actualizado
    const players = matchPlayers.map((mp) => mp.player);
    this.playerRepository.save(players);
  }

  private getPlayersNeeded(sport: Sport) {
    const sports = {
      tennis: 2,
      football: 22,
      basketball: 10,
      volleyball: 12,
    };
    return sports[sport] || 0;
  }

  private buildMatchQuery() {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoin('match.matchPlayers', 'matchPlayer')
      .leftJoin('matchPlayer.player', 'player')
      .select([
        'match',
        'matchPlayer',
        'player.id',
        'player.name',
        'player.lastName',
      ]);
  }

  private async getCompatiblePlayers(
    hostPlayer: Player,
    playersNeeded: number,
  ) {
    const [longitude, latitude] = hostPlayer.coordinates.coordinates;
    const searchRadiusKm = 200;

    // Buscar jugadores cercanos y con ranking compatible
    const compatiblePlayers = await this.playerRepository
      .createQueryBuilder('p')
      .where('p.id != :playerId', { playerId: hostPlayer.id })
      .andWhere('ABS(p.ranking - :ranking) <= :tolerance', {
        ranking: hostPlayer.ranking,
        tolerance: 50,
      })
      .andWhere(
        `ST_DistanceSphere(
        p.coordinates,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
      ) / 1000 <= :radius`,
        {
          longitude,
          latitude,
          radius: searchRadiusKm,
        },
      )
      .orderBy('RANDOM()')
      .limit(playersNeeded - 1)
      .getMany();

    return compatiblePlayers;
  }

  private async assignPlayersToMatch(
    hostPlayer: Player,
    compatiblePlayers: Player[],
    sport: Sport,
  ) {
    // Crear el juego para el deporte requerido
    const match = this.matchRepository.create({ sport });
    await this.matchRepository.save(match);

    // Asignar jugadores a los equipos
    const availablePlayers = [hostPlayer, ...compatiblePlayers];
    const matchPlayers = availablePlayers.map((player, index) => ({
      player,
      match,
      teamNumber: index % 2 === 0 ? 1 : 2,
    }));

    await this.matchPlayersRepository.save(matchPlayers);
    return match;
  }
}
