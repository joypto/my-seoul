import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
