import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangePrivileges {  
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isSuperAdmin: boolean;
}