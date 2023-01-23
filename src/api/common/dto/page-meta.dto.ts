import { ApiProperty } from '@nestjs/swagger';
import { PageOptionDto } from './page-option.dto';

export class PageMetaDto {
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

    constructor(dto: PageOptionDto, itemCount: number) {
        this.page = dto.page;
        this.take = dto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
