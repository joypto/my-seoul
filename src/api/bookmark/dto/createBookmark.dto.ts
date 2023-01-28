import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookmarkDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'authorId', type: Number })
    collectionId: number;
}
