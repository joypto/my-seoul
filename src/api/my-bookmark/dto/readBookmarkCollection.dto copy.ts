import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadBookmarkUserDto extends PageOption {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'collectionId', type: Number })
    collectionId: number | undefined;

    get pageOptions(): PageOption {
        return Builder(PageOption).order(this.order).page(this.page).take(this.take).build();
    }
}
