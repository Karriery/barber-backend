import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class ChangeSpecialityDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  specialityId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
