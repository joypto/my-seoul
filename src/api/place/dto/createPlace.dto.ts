import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name', type: String })
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String })
    description: string | undefined;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'latitude', type: Number })
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'longitude', type: Number })
    longitude: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'address', type: String })
    address: string | undefined;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'collectionId', type: Number })
    collectionId: number;
}
