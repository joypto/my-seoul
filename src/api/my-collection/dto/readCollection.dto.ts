import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { SearchCollectionOption } from 'src/api/my-collection/dto/searchCollection.dto';

export class ReadCollectionDto extends SearchCollectionOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'authorId', type: Number })
    authorId: number | undefined;
}
