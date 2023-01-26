import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlaceDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'name', type: String })
    name: string | null;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String })
    description: string | null;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'latitude', type: Number })
    latitude: number | null;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'longitude', type: Number })
    longitude: number | null;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'collectionId', type: Number })
    collectionId: number | null;
}
