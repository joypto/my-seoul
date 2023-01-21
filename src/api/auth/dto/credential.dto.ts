import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthDto } from './basic.dto';

export class AuthCredentialDto extends AuthDto {
    @IsString()
    @ApiProperty({ description: 'password', type: String, required: true })
    password: string;
}
