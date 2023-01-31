import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { SearchOption } from 'src/api/common/search/option.dto';

export class ReadCollectionDto extends SearchOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'authorId', type: Number })
    authorId: number | undefined;
}
