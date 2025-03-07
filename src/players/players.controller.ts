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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @ApiOperation({
    summary: 'Create a player',
    description: 'Create a player',
  })
  @ApiParam({
    name: 'createPlayerDto',
    description: 'Create a player',
    type: CreatePlayerDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Player created',
    type: CreatePlayerDto,
  })
  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.createPlayer(createPlayerDto);
    return createResponse(player, 'Player created', HttpStatus.CREATED);
  }

  @ApiOperation({
    summary: 'Get all players',
    description: 'Get all players',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all players',
    type: [CreatePlayerDto],
  })
  @Get()
  async findAllPLayers() {
    const players = await this.playerService.findAllPlayers();
    return createResponse(players, 'Players found', HttpStatus.OK);
  }

  @ApiOperation({
    summary: 'Get a player by ID',
    description: 'Get a player by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the player',
  })
  @ApiResponse({
    status: 200,
    description: 'Player found',
    type: CreatePlayerDto,
  })
  @Get(':id')
  async findOnePlayer(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playerService.findOnePlayer(id);
    return createResponse(player, 'Player found', HttpStatus.OK);
  }

  @ApiOperation({
    summary: 'Update a player',
    description: 'Update a player by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the player',
  })
  @ApiResponse({
    status: 200,
    description: 'Player updated',
    type: CreatePlayerDto,
  })
  @Patch(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playerService.updatePlayer(id, updatePlayerDto);
    return createResponse(player, 'Player updated', HttpStatus.OK);
  }

  @ApiOperation({
    summary: 'Delete a player',
    description: 'Delete a player by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the player',
  })
  @ApiResponse({
    status: 200,
    description: 'Player deleted',
  })
  @Delete(':id')
  async removePlayer(@Param('id', ParseIntPipe) id: number) {
    await this.playerService.removePlayer(id);
    return createResponse(null, 'Player deleted', HttpStatus.OK);
  }
}
