import { ApiProperty } from '@nestjs/swagger';
import { GlobalUser } from './globalUser.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends GlobalUser {
  @ApiProperty()
  @Prop()
  fingerPrint: string;

  @ApiProperty()
  @Prop()
  faceId: string;

  @ApiProperty()
  @Prop()
  apiKey: string;

  async checkBiometricOrKey(key) {
    return (
      key === this.apiKey || key === this.faceId || key === this.fingerPrint
    );
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
