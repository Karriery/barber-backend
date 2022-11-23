import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Cut } from 'src/modules/cut/entities/cut.entity';

@Schema({ timestamps: true })
export class Recipe {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Cut })
  cut: Cut;

  @ApiProperty()
  @Prop({ default: 0 })
  price: number;

  @ApiProperty()
  @Prop({ default: 0 })
  tva: number;

  createdAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

export type RecipeDocument = Recipe & Document;
