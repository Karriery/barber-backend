import { GlobalUser } from './globalUser.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Admin extends GlobalUser {
  @ApiProperty()
  @Prop()
  _id: string;

  @ApiProperty()
  @Prop({ default: 0 })
  priceModification: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = Admin & Document;
