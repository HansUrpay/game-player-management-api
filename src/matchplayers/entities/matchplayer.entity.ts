import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MatchResult } from '../enums/match-result.enum';

@Entity('match_players')
export class MatchPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, (match) => match.matchPlayers)
  match: Match;

  @ManyToOne(() => Player, (player) => player.matchPlayers)
  player: Player;

  @Column({
    type: 'enum',
    enum: MatchResult,
    nullable: true,
  })
  result: MatchResult;

  @Column({
    default: 0,
  })
  teamNumber: number;
}
