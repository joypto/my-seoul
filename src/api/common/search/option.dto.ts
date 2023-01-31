import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOption } from '../page/option.dto';
import { SortAscending, SortBy } from './sort.enum';

export class SearchOption extends PageOption {
    @IsEnum(SortAscending)
    @IsOptional()
    @ApiPropertyOptional({ default: SortAscending.DESC })
    readonly sortAscending?: SortAscending = SortAscending.DESC;

    @IsEnum(SortBy)
    @IsOptional()
    @ApiPropertyOptional({ default: SortBy.CREATED_DATE })
    readonly sortBy?: SortBy = SortBy.CREATED_DATE;

    get serachOptions(): SearchOption {
        return Builder(SearchOption)
            .page(this.page)
            .take(this.take)
            .sortAscending(this.sortAscending)
            .sortBy(this.sortBy)
            .build();
    }
}
