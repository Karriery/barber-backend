import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  isNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCutDto {
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  //@IsNotEmpty()
  image;

  @ApiProperty()
  @IsNumberString()
  price: number;
}
