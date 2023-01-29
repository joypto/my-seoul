import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UsernameDto } from './username.dto';

export class AuthCredentialDto extends UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'password', type: String, required: true })
    password: string;
}
