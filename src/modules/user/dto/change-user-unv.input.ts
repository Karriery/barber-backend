import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class ChangeUnvDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  unvId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
