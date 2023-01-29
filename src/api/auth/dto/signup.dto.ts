import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthCredentialDto } from './credential.dto';

export class AuthSignupDto extends AuthCredentialDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', type: String })
    email: string;
}
