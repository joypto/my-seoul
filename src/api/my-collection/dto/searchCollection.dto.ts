import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsEnum, IsOptional } from 'class-validator';
import { SearchOption } from 'src/api/common/search/option.dto';
import { SortBy } from '../../common/search/sort.enum';

export class SearchCollectionOption extends SearchOption {
    @IsEnum(SortBy)
    @IsOptional()
    @ApiPropertyOptional({ default: SortBy.CREATED_DATE })
    readonly sortBy?: SortBy = SortBy.CREATED_DATE;

    get serachOptions(): SearchCollectionOption {
        return Builder(SearchCollectionOption)
            .page(this.page)
            .take(this.take)
            .sortAscending(this.sortAscending)
            .sortBy(this.sortBy)
            .build();
    }
}
