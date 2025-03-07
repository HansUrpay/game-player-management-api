import { ApiProperty } from '@nestjs/swagger';
import { ResponseMatchPlayerDto } from 'src/matchplayers/dto/response-match-player.dto';

export class ResponseMatchDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'tennis' })
  sport: string;

  @ApiProperty({ example: '1' })
  winingTeam: string;

  @ApiProperty({ example: 5 })
  scoreTeam1: number;

  @ApiProperty({ example: 2 })
  scoreTeam2: number;

  @ApiProperty({ type: [ResponseMatchPlayerDto] })
  matchPlayers: ResponseMatchPlayerDto[];
}
