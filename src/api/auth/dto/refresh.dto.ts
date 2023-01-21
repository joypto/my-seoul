import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './basic.dto';

export class AuthRefreshDto extends AuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'refresh token', type: String, required: true })
    refreshToken: string;
}
