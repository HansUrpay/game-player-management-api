import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { PlayerService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.createPlayer(createPlayerDto);
    return createResponse(player, 'Player created', HttpStatus.CREATED);
  }

  @Get()
  async findAllPLayers() {
    const players = await this.playerService.findAllPlayers();
    return createResponse(players, 'Players found', HttpStatus.OK);
  }

  @Get(':id')
  async findOnePlayer(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playerService.findOnePlayer(id);
    return createResponse(player, 'Player found', HttpStatus.OK);
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playerService.updatePlayer(id, updatePlayerDto);
    return createResponse(player, 'Player updated', HttpStatus.OK);
  }

  @Delete(':id')
  async removePlayer(@Param('id', ParseIntPipe) id: number) {
    await this.playerService.removePlayer(id);
    return createResponse(null, 'Player deleted', HttpStatus.OK);
  }
}
