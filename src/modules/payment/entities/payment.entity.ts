import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Cut } from 'src/modules/cut/entities/cut.entity';
import { User } from 'src/modules/user/entities/user.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  CC = 'CC',
}

@Schema()
export class Payment {
  @ApiProperty()
  @Prop()
  _id: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  user: User;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Cut }] })
  cut: Cut;

  @ApiProperty()
  @Prop({ default: PaymentMethod.CASH })
  method: PaymentMethod;

  @ApiProperty()
  @Prop({ nullable: true })
  clientName: string;

  @ApiProperty()
  @Prop({ default: 0 })
  promo: number;

  @ApiProperty()
  @Prop({ default: 0 })
  priceModification: number;

  @ApiProperty()
  @Prop({ default: 0 })
  cost: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentDocument = Payment & Document;
