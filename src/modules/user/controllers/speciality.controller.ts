import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles, Role } from "src/modules/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CreateSpecialityDto } from "../dto/create-speciality.input.dto copy";
import { UpdateSpecialityDto } from "../dto/update-speciality.input.dto";
import { SpecialityService } from "../services/speciality.service";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags("speciality")
@Controller("speciality")
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Get()
  findAll() {
    return this.specialityService.findAll();
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.specialityService.findOne(+id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSpecialityDto: UpdateSpecialityDto
  ) {
    return this.specialityService.update(+id, updateSpecialityDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.specialityService.remove(+id);
  }
}
