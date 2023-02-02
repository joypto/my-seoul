import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOption } from '../page/option.dto';
import { SortAscending } from './sort.enum';

export class SearchOption extends PageOption {
    @IsEnum(SortAscending)
    @IsOptional()
    @ApiPropertyOptional({ default: SortAscending.DESC })
    readonly sortAscending?: SortAscending = SortAscending.DESC;
}
