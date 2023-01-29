import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'username', type: String, required: true })
    username: string;
}
