import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', type: String })
    email: string;
}
