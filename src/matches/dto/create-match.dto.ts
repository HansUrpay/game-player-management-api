import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Sport } from '../enums/sport.enum';

export class CreateMatchDto {
  @IsEnum(Sport)
  sport: Sport;
}
