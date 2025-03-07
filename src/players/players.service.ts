import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { getCoordinates } from 'src/utils/geolocation';

/**
 * @description Player service contain all the business logic for the player entity
 */
@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly repository: Repository<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    try {
      // Verificar si existe otro jugador con el mismo email
      await this.checkIfEmailExists(createPlayerDto.email);

      // Crear y guardar el nuevo jugador
      const player = this.repository.create(createPlayerDto);
      player.completedProfile = this.calculateProfileCompletion(player);

      // Calcular coordenadas en base a la ubicacion del jugador
      if (createPlayerDto.location) {
        const { lat, lng } = await getCoordinates(createPlayerDto.location);
        player.coordinates = {
          type: 'Point',
          coordinates: [lng, lat],
        };
      }

      return await this.repository.save(player);
    } catch (error) {
      throw new HttpException(
        `Error creating player: ${error.detail || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllPlayers() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException(
        `Error fetching players: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOnePlayer(id: number) {
    try {
      const playerFound = await this.repository.findOne({
        where: { id },
      });

      if (!playerFound) {
        throw new NotFoundException('Player not found');
      }

      return playerFound;
    } catch (error) {
      throw new HttpException(
        `Error fetching player: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePlayer(id: number, updatePlayerDto: UpdatePlayerDto) {
    const playerFound = await this.findOnePlayer(id);

    try {
      // Verificar si existe otro jugador con el mismo email
      if (updatePlayerDto.email) {
        await this.checkIfEmailExists(updatePlayerDto.email);
      }

      // Calcular coordenadas en base a la ubicacion del jugador
      if (updatePlayerDto.location) {
        const { lat, lng } = await getCoordinates(updatePlayerDto.location);
        playerFound.coordinates = {
          type: 'Point',
          coordinates: [lng, lat],
        };
      }

      // Actualizar y guardar el jugador
      Object.assign(playerFound, updatePlayerDto);
      playerFound.completedProfile =
        this.calculateProfileCompletion(playerFound);

      return await this.repository.save(playerFound);
    } catch (error) {
      throw new HttpException(
        `Error updating player: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removePlayer(id: number) {
    const result = await this.repository.update(id, { deletedAt: new Date() });

    if (result.affected === 0) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }
  }

  private async checkIfEmailExists(email: string, excludeId?: number) {
    if (!email) return;

    const existPlayer = await this.repository.findOneBy({
      email,
    });

    if (existPlayer && existPlayer.id !== excludeId) {
      throw new ConflictException('A user with email already exists');
    }
  }

  private calculateProfileCompletion(player: Player) {
    const fieldsToCalculate: (keyof Player)[] = [
      'name',
      'lastName',
      'location',
    ];
    const totalFields = fieldsToCalculate.length;

    // Obtener total de campos completados
    const completedFields = fieldsToCalculate.filter((field) => {
      const value = player[field];
      return value !== null && value !== '' && value !== undefined;
    }).length;

    // Calcular el procentaje completado
    const percentage = (completedFields / totalFields) * 100;
    return Math.round(percentage);
  }
}
