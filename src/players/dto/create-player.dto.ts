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
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  lastName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 50)
  @IsOptional()
  location?: string;
}
