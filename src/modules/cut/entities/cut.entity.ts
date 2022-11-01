import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Cut {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop()
  tva: number;

  createdAt: Date;

  updatedAt: Date;
}

export const CutSchema = SchemaFactory.createForClass(Cut);

export type CutDocument = Cut & Document;
