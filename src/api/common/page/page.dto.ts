import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMeta } from './meta.dto';

export class Page<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty()
    meta: PageMeta;

    constructor(data: T[], meta: PageMeta) {
        this.data = data;
        this.meta = meta;
    }
}
