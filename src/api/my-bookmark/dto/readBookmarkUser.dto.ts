import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadBookmarkCollectionDto extends PageOption {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'userId', type: Number })
    userId: number | undefined;
}
