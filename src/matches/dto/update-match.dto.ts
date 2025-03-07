import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  winingTeam?: string;

  @Min(0)
  scoreTeam1: number;

  @Min(0)
  scoreTeam2: number;
}
