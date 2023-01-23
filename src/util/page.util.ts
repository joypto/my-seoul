import { PageMetaDto } from 'src/api/common/dto/page-meta.dto';
import { PageOptionDto } from 'src/api/common/dto/page-option.dto';
import { PageDto } from 'src/api/common/dto/page.dto';
import { SelectQueryBuilder } from 'typeorm';

export class PageUtil<T> {
    private async getData(queryBuilder: SelectQueryBuilder<T>): Promise<T[]> {
        const { entities } = await queryBuilder.getRawAndEntities();
        return entities;
    }

    private async getMeta(
        queryBuilder: SelectQueryBuilder<T>,
        pageOptions: PageOptionDto
    ): Promise<PageMetaDto> {
        const itemCount = await queryBuilder.getCount();
        return new PageMetaDto(pageOptions, itemCount);
    }

    async getResponse(
        queryBuilder: SelectQueryBuilder<T>,
        pageOptions: PageOptionDto
    ): Promise<PageDto<T>> {
        const pageData = await this.getData(queryBuilder);
        const pageMeta = await this.getMeta(queryBuilder, pageOptions);
        return new PageDto(pageData, pageMeta);
    }
}
