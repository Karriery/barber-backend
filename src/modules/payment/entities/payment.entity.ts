import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Cut } from 'src/modules/cut/entities/cut.entity';
import { User } from 'src/modules/user/entities/user.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  CC = 'CC',
}

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  user: User;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Cut }] })
  cuts: Cut[];

  @ApiProperty()
  @Prop({ default: PaymentMethod.CASH, enum: PaymentMethod })
  method: string;

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
  manualProfit: number;

  @ApiProperty()
  @Prop({ default: 0 })
  cost: number;

  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentDocument = Payment & Document;
