import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name', type: String })
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String })
    description: string | undefined;
}
