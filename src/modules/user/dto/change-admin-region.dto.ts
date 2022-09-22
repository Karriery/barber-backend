import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ChangeAdminRegion {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    regionId: number;
}