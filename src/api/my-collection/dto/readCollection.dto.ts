import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNumber, IsOptional } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadCollectionDto extends PageOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'authorId', type: Number })
    authorId: number | undefined;

    get pageOptions(): PageOption {
        return Builder(PageOption).order(this.order).page(this.page).take(this.take).build();
    }
}
