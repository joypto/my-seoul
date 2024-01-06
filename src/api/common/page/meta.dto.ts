import { ApiProperty } from '@nestjs/swagger';
import { PageOption } from './option.dto';

export class PageMeta {
    @ApiProperty()
    pageCount: number;

    @ApiProperty()
    itemCount: number;

    @ApiProperty()
    totalCount: number;

    constructor(dto: PageOption, totalCount: number) {
        this.pageCount = dto.pageCount;
        this.itemCount = dto.itemCount;
        this.totalCount = totalCount;
    }
}
