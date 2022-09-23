import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Payment {
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

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentDocument = Payment & Document;
