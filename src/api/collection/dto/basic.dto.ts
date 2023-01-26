import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CollectionDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'name', type: String, nullable: true })
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String, nullable: true })
    description: string | null;
}
