import { Injectable } from '@nestjs/common';
import { CreateMatchplayerDto } from './dto/create-matchplayer.dto';
import { UpdateMatchplayerDto } from './dto/update-matchplayer.dto';

@Injectable()
export class MatchplayersService {
  create(createMatchplayerDto: CreateMatchplayerDto) {
    return null;
  }

  findAll() {
    return null;
  }

  findOne(id: number) {
    return null;
  }

  update(id: number, updateMatchplayerDto: UpdateMatchplayerDto) {
    return null;
  }

  remove(id: number) {
    return null;
  }
}
