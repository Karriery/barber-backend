import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class BiometricLoginRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  key: string;
}
