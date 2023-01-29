import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CodeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'code', type: String })
    code: string;
}
