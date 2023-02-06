import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'username', type: String, required: true })
    username: string;
}

export class CredentialDto extends UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'password', type: String, required: true })
    password: string;
}

export class SignupDto extends CredentialDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', type: String })
    email: string;
}

export class RefreshDto extends UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'refresh token', type: String, required: true })
    refreshToken: string;
}

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', type: String })
    email: string;
}

export class EmailAuthDto extends EmailDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'auth code', type: String })
    authCode: string;
}

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'old password', type: String })
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'new password', type: String })
    newPassword: string;
}
