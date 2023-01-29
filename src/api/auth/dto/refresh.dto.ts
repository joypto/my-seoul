import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UsernameDto } from './username.dto';

export class AuthRefreshDto extends UsernameDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'refresh token', type: String, required: true })
    refreshToken: string;
}
