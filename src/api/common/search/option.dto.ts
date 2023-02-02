import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOption } from '../page/option.dto';
import { SortAscending } from './sort.enum';

export class SearchOption extends PageOption {
    @IsEnum(SortAscending)
    @IsOptional()
    @ApiPropertyOptional({ enum: SortAscending, default: SortAscending.DESC })
    readonly sortAscending?: SortAscending = SortAscending.DESC;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly keyword: string;
}
