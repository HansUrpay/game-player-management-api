import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchplayerDto } from './create-matchplayer.dto';

export class UpdateMatchplayerDto extends PartialType(CreateMatchplayerDto) {}
