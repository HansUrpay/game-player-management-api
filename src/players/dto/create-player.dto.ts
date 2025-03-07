import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'The email of the player',
    example: 'johndoe@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the player',
    example: 'John',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description: 'The last name of the player',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  lastName: string;

  @ApiProperty({
    description: 'The location of the player',
    example: 'Buenos Aires, Argentina',
    required: false,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  @IsOptional()
  location?: string;
}
