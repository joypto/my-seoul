import { ApiProperty } from '@nestjs/swagger';
import { PageOption } from './option.dto';

export class PageMeta {
    @ApiProperty()
    page: number;

    @ApiProperty()
    take: number;

    @ApiProperty()
    itemCount: number;

    @ApiProperty()
    pageCount: number;

    @ApiProperty()
    hasPreviousPage: boolean;

    @ApiProperty()
    hasNextPage: boolean;

    constructor(dto: PageOption, itemCount: number) {
        this.page = dto.page;
        this.take = dto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
