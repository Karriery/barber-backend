import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CutService } from '../services/cut.service';
import { CreateCutDto } from '../dto/create-cut.dto';
import { UpdateCutDto } from '../dto/update-cut.dto';
import { Roles, Role } from 'src/modules/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/upload';

@UseGuards(JwtAuthGuard)
@ApiTags('cut')
@ApiBearerAuth()
@Controller('cut')
export class CutController {
  constructor(private readonly cutService: CutService) {}

  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image', { storage }))
  @Post()
  create(
    @Body() createCutDto: CreateCutDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createCutDto.image = file.filename;
    return this.cutService.create(createCutDto);
  }

  @Get()
  findAll() {
    return this.cutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCutDto: UpdateCutDto) {
    return this.cutService.update(id, updateCutDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cutService.remove(id);
  }
}
