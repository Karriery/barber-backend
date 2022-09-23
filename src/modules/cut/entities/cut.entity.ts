import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

@Schema()
export class Cut {
  @ApiProperty()
  @Prop()
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
}

export const CutSchema = SchemaFactory.createForClass(Cut);

export type CutDocument = Cut & Document;
