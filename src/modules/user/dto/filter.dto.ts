import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export class FilterUserDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false })
  nriId: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false })
  unvId: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false })
  specialityId: number;
}

export class FilterAdminDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false })
  regionId: number;
}
