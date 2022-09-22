import { ApiProperty } from '@nestjs/swagger';
import { GlobalUser } from './globalUser.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends GlobalUser {}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
