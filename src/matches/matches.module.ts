import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchplayersModule } from 'src/matchplayers/matchplayers.module';
import { PlayerModule } from 'src/players/players.module';
import { MatchPlayer } from 'src/matchplayers/entities/matchplayer.entity';
import { Player } from 'src/players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchPlayer, Player]), MatchplayersModule, PlayerModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
