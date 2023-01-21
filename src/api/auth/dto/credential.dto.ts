import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './basic.dto';

export class AuthCredentialDto extends AuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'password', type: String, required: true })
    password: string;
}
