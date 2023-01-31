import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PageOption } from 'src/api/common/page/option.dto';

export class ReadBookmarkUserDto extends PageOption {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'collectionId', type: Number })
    collectionId: number | undefined;
}
