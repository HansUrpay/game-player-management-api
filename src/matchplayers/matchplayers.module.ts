import { Module } from '@nestjs/common';
import { MatchplayersService } from './matchplayers.service';
import { MatchplayersController } from './matchplayers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPlayer } from './entities/matchplayer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchPlayer])],
  controllers: [MatchplayersController],
  providers: [MatchplayersService],
})
export class MatchplayersModule {}
