import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  winingTeam?: string;

  @ApiProperty({
    description: 'The score of the first team',
    example: 3,
    required: true,
    minimum: 0,
  })
  @Min(0)
  scoreTeam1: number;

  @ApiProperty({
    description: 'The score of the second team',
    example: 3,
    required: true,
    minimum: 0,
  })
  @Min(0)
  scoreTeam2: number;
}
