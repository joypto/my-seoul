import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsEnum, IsOptional } from 'class-validator';
import { SearchOption } from 'src/api/common/search/option.dto';
import { CollectionSortBy } from '../../common/search/sort.enum';

export class SearchCollectionOption extends SearchOption {
    @IsEnum(CollectionSortBy)
    @IsOptional()
    @ApiPropertyOptional({ enum: CollectionSortBy, default: CollectionSortBy.CREATED_DATE })
    readonly sortBy?: CollectionSortBy = CollectionSortBy.CREATED_DATE;

    get serachOptions(): SearchCollectionOption {
        return Builder(SearchCollectionOption)
            .page(this.page)
            .take(this.take)
            .sortAscending(this.sortAscending)
            .sortBy(this.sortBy)
            .keyword(this.keyword)
            .build();
    }
}
