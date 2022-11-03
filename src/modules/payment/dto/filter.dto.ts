import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsBooleanString,
} from 'class-validator';

export class PaymentFilter {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  limit: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  userId: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  date: string;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: false })
  widthrwal: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  cursor: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: true })
  asc: boolean;
}
