import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlayerDto } from 'src/players/dto/response-player.dto';

export class ResponseMatchPlayerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Win' })
  result: string;

  @ApiProperty({ example: 1 })
  teamNumber: number;

  @ApiProperty({ type: ResponsePlayerDto })
  player: ResponsePlayerDto;
}
