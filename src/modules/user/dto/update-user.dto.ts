import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"] as const)
) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 300 })
  notificationTime: number;
}
