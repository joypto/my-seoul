import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNumber, IsOptional } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadPlaceDto extends PageOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'collectionId', type: Number })
    collectionId: number;

    get pageOptions(): PageOption {
        return Builder(PageOption).order(this.order).page(this.page).take(this.take).build();
    }
}
