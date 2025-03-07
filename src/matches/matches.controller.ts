import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('/by-player/:id')
  async createMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMatchDto: CreateMatchDto,
  ) {
    const matchCreated = await this.matchesService.createMatch(
      id,
      createMatchDto,
    );
    return createResponse(matchCreated, 'Match created', 201);
  }

  @Get()
  async findAllMatches() {
    const matches = await this.matchesService.findAllMatches();
    return createResponse(matches, 'Matches found', 200);
  }

  @Get(':id')
  async findOneMatch(@Param('id', ParseIntPipe) id: number) {
    const match = await this.matchesService.findOneMatch(id);
    return createResponse(match, 'Match found', 200);
  }

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

  @Delete(':id')
  removeMatch(@Param('id') id: string) {
    return this.matchesService.removeMatch(+id);
  }
}
