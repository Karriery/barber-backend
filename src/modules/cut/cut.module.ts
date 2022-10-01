import { Module } from '@nestjs/common';
import { CutService } from './services/cut.service';
import { CutController } from './controllers/cut.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cut, CutSchema } from './entities/cut.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cut.name, schema: CutSchema }])],
  controllers: [CutController],
  exports: [CutService],
  providers: [CutService],
})
export class CutModule {}
