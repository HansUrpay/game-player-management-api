import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchplayersService } from './matchplayers.service';
import { CreateMatchplayerDto } from './dto/create-matchplayer.dto';
import { UpdateMatchplayerDto } from './dto/update-matchplayer.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('matchplayers')
export class MatchplayersController {
  constructor(private readonly matchplayersService: MatchplayersService) {}

  @Post()
  create(@Body() createMatchplayerDto: CreateMatchplayerDto) {
    return this.matchplayersService.create(createMatchplayerDto);
  }

  @Get()
  findAll() {
    return this.matchplayersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchplayersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchplayerDto: UpdateMatchplayerDto) {
    return this.matchplayersService.update(+id, updateMatchplayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchplayersService.remove(+id);
  }
}
