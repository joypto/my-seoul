import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CredentialDto } from './credential.dto';

export class SignupDto extends CredentialDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', type: String })
    email: string;
}
