import { PartialType } from "@nestjs/mapped-types";
import { CreateSpecialityDto } from "./create-speciality.input.dto copy";

export class UpdateSpecialityDto extends PartialType(CreateSpecialityDto) {}
