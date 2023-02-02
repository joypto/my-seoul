import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadPlaceDto extends PageOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'collectionId', type: Number })
    collectionId: number;
}
