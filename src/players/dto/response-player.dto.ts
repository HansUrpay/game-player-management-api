import { ApiProperty } from '@nestjs/swagger';

export class ResponsePlayerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pedro' })
  name: string;

  @ApiProperty({ example: 'Perez' })
  lastName: string;
}
