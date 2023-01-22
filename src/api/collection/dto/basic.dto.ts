import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CollectionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name', type: String, required: true })
    name: string;

    @IsString()
    @ApiProperty({ description: 'description', type: String, nullable: true })
    description: string | null;
}
