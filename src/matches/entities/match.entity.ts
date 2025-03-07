import { MatchPlayer } from 'src/matchplayers/entities/matchplayer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MatchWinner } from '../enums/match-winner.enum';
import { Sport } from '../enums/sport.enum';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MatchPlayer, (matchplayer) => matchplayer.match)
  matchPlayers: MatchPlayer[];

  @Column({
    type: 'enum',
    enum: Sport,
  })
  sport: Sport;

  @Column({
    type: 'enum',
    enum: MatchWinner,
    nullable: true,
  })
  winingTeam: MatchWinner;

  @Column({
    nullable: true,
  })
  scoreTeam1: number;

  @Column({
    nullable: true,
  })
  scoreTeam2: number;
}
