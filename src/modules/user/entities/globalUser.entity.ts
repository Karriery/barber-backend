import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class GlobalUser {
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
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @ApiProperty()
  @Prop()
  phone: string;

  @ApiProperty()
  @Prop()
  connections: number;

  @ApiProperty()
  @Prop({ default: false })
  isAdmin: boolean;

  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}
