import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseMatchDto } from './dto/response-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({
    summary: 'Create a match',
    description:
      'Creates a match using the given player ID. If there are no available players for the selected sport, the response will indicate "Waiting for players". Otherwise, a match will be created with initial game values set to null',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the player creating the match',
  })
  @ApiResponse({
    status: 201,
    description: 'Match created',
  })
  @Post('/by-player/:id')
  async createMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMatchDto: CreateMatchDto,
  ) {
    const matchCreated = await this.matchesService.createMatch(
      id,
      createMatchDto,
    );
    if (matchCreated.playersMissing) {
      throw new HttpException(
        createResponse(matchCreated, 'Players missing', 400),
        HttpStatus.BAD_REQUEST,
      );
    }

    return createResponse(matchCreated, 'Match created', 201);
  }

  @ApiOperation({
    summary: 'Get all matches',
    description: 'Get all matches',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all matches',
    type: [ResponseMatchDto],
  })
  @Get()
  async findAllMatches() {
    const matches = await this.matchesService.findAllMatches();
    return createResponse(matches, 'Matches found', 200);
  }

  @ApiOperation({
    summary: 'Get a match by ID',
    description: 'Get a match by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the match',
  })
  @ApiResponse({
    status: 200,
    description: 'Match found',
    type: ResponseMatchDto,
  })
  @Get(':id')
  async findOneMatch(@Param('id', ParseIntPipe) id: number) {
    const match = await this.matchesService.findOneMatch(id);
    return createResponse(match, 'Match found', 200);
  }

  @ApiOperation({
    summary: 'Update a match',
    description:
      'Updates a match by its ID. This endpoint receives the game results, updating the match details and recalculating the ranking of the players based on the outcome',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the match',
  })
  @ApiResponse({
    status: 200,
    description: 'Match updated',
    type: ResponseMatchDto,
  })
  @Patch(':id')
  async updateMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const updatedMatch = await this.matchesService.updateMatch(
      id,
      updateMatchDto,
    );
    return createResponse(updatedMatch, 'Match updated', 200);
  }

  @ApiOperation({
    summary: 'Delete a match',
    description: 'Delete a match by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the match',
  })
  @ApiResponse({
    status: 200,
    description: 'Match deleted',
  })
  @Delete(':id')
  async removeMatch(@Param('id', ParseIntPipe) id: number) {
    await this.matchesService.removeMatch(id);
    return createResponse(null, 'Match deleted', 200);
  }
}
