import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOption {
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @ApiPropertyOptional({ default: 1 })
    readonly pageCount?: number = 1;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @Max(50)
    @ApiPropertyOptional({ default: 10 })
    readonly itemCount?: number = 10;

    get skip(): number {
        return (this.pageCount - 1) * this.itemCount;
    }

    get pageOptions(): PageOption {
        return Builder(PageOption).pageCount(this.pageCount).itemCount(this.itemCount).build();
    }
}
