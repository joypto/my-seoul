import { ApiPropertyOptional } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNumber, IsOptional } from 'class-validator';
import { PageOptionDto } from 'src/api/common/dto/page-option.dto';

export class CollectionReqDto extends PageOptionDto {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'authorId', type: Number, nullable: true })
    authorId: number;

    get pageOptions(): PageOptionDto {
        return Builder(PageOptionDto).order(this.order).page(this.page).take(this.take).build();
    }
}
