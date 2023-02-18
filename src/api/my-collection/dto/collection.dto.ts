import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { SearchOption } from 'src/api/common/search/option.dto';
import { CollectionSortBy } from 'src/api/common/search/sort.enum';

export class CreateCollectionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name', type: String })
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String })
    description: string | undefined;
}

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

export class ReadCollectionDto extends SearchCollectionOption {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'authorId', type: Number })
    authorId: number | undefined;
}

export class UpdateCollectionDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'name', type: String, nullable: true })
    name: string | undefined;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description', type: String, nullable: true })
    description: string | undefined;
}
