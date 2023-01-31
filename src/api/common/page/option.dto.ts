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
    readonly page?: number = 1;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @Max(50)
    @ApiPropertyOptional({ default: 10 })
    readonly take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }

    get pageOptions(): PageOption {
        return Builder(PageOption).page(this.page).take(this.take).build();
    }
}
