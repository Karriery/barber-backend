import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Cut } from 'src/modules/cut/entities/cut.entity';
import { User } from 'src/modules/user/entities/user.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  CC = 'CC',
}

export enum WithdrawalReason {
  PERSONAL_COST = 'PERSONAL_COST',
  CUT_COST = 'CUT_COST',
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
  @Prop({ default: [PaymentMethod.CASH] })
  method: [];

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
  manualProfitCash: number;

  @ApiProperty()
  @Prop({ default: 0 })
  manualProfitCreditCard: number;

  @ApiProperty()
  @Prop({ default: 0 })
  cost: number;

  @ApiProperty()
  @Prop({ default: null, nullable: true })
  costReason: string;

  @ApiProperty()
  @Prop({ nullable: true })
  description: string;

  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentDocument = Payment & Document;
