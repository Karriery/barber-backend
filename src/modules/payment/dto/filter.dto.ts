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
  @ApiProperty({ required: false, default: 'false' })
  widthrwal: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  cursor: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: true })
  asc: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  dateStart;

  @IsOptional()
  @ApiProperty({ required: false })
  dateEnd;
}
