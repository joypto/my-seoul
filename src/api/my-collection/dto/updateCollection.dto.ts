import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCollectionDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'name', type: String, nullable: true })
    name: string | undefined;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String, nullable: true })
    description: string | undefined;
}
