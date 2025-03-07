import { MatchPlayer } from 'src/matchplayers/entities/matchplayer.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MatchPlayer, (matchplayer) => matchplayer.player)
  matchPlayers: MatchPlayer[];

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  lastName: string;

  @Column({
    default: 0,
  })
  ranking: number;

  @Column({
    length: 200,
    nullable: true,
  })
  location: string;

  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @Column({
    default: 0,
  })
  completedProfile: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
