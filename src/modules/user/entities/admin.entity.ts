import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Admin {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ default: 0 })
  priceModification: number;

  @ApiProperty()
  @Prop()
  email: string;

  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ nullable: 0 })
  phone: string;

  @ApiProperty()
  @Prop({ default: 0 })
  connections: number;

  @ApiProperty()
  @Prop({ default: false })
  isAdmin: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = Admin & Document;
