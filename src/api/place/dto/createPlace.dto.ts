import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name', type: String, required: true })
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String, nullable: true })
    description: string | null;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'latitude', type: Number, required: true })
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'longitude', type: Number, required: true })
    longitude: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'collectionId', type: Number, required: true })
    collectionId: number;
}
