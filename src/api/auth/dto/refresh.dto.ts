import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthDto } from './basic.dto';

export class AuthRefreshDto extends AuthDto {
    @IsString()
    @ApiProperty({ description: 'refresh token', type: String, required: true })
    refreshToken: string;
}
