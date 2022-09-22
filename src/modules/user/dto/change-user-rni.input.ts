import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class ChangeNriDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  nriId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
