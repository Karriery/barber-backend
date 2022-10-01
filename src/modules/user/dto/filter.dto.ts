import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UserFilter {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  age: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  legalId: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  limit: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  cursor: number;
}

export class AdminFilter {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  limit: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  cursor: number;
}
