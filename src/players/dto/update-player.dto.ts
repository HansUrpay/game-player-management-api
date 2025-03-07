import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @ApiProperty({
    description: 'The name of the player',
    example: 'John',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The email of the player',
    example: 'johndoe@gmail.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The last name of the player',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'The location of the player',
    example: 'Buenos Aires, Argentina',
    required: false,
  })
  location?: string;
}
