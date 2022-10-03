import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import mongoose from 'mongoose';
import { Exclude } from 'class-transformer';

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  gender: string;

  @ApiProperty()
  @Prop()
  age: number;

  @ApiProperty()
  @Prop()
  legalId: string;

  @ApiProperty()
  @Prop()
  fingerPrint: string;

  @ApiProperty()
  @Prop()
  faceId: string;

  @ApiProperty()
  @Prop()
  apiKey: string;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Payment }],
  })
  payments: Payment[];

  @ApiProperty()
  @Prop()
  phone: string;

  @ApiProperty()
  @Prop()
  connections: number;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
