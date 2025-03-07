import {
  IsEnum
} from 'class-validator';
import { Sport } from '../enums/sport.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    description: 'The type of sport',
    example: 'tennis',
    enum: Sport,
    required: true,
  })
  @IsEnum(Sport)
  sport: Sport;
}
