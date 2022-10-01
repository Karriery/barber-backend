import { ApiProperty } from '@nestjs/swagger';
import { GlobalUser } from './globalUser.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import mongoose from 'mongoose';

@Schema()
export class User extends GlobalUser {
  @ApiProperty()
  @Prop()
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

  async checkBiometricOrKey(key) {
    return (
      key === this.apiKey || key === this.faceId || key === this.fingerPrint
    );
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
