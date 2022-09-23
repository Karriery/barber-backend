import { PartialType } from '@nestjs/swagger';
import { CreateCutDto } from './create-cut.dto';

export class UpdateCutDto extends PartialType(CreateCutDto) {}
