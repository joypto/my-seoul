import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EmailDto } from './email.dto';

export class EmailAuthDto extends EmailDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'auth code', type: String })
    authCode: string;
}
