import { PageMeta } from 'src/api/common/page/meta.dto';
import { PageOption } from 'src/api/common/page/option.dto';
import { Page } from 'src/api/common/page/page.dto';
import { SelectQueryBuilder } from 'typeorm';

export class PageUtil<T> {
    private async getData(queryBuilder: SelectQueryBuilder<T>): Promise<T[]> {
        const { entities } = await queryBuilder.getRawAndEntities();
        return entities;
    }

    private async getMeta(
        queryBuilder: SelectQueryBuilder<T>,
        pageOptions: PageOption
    ): Promise<PageMeta> {
        const totalCount = await queryBuilder.getCount();
        return new PageMeta(pageOptions, totalCount);
    }

    async getResponse(
        queryBuilder: SelectQueryBuilder<T>,
        pageOptions: PageOption
    ): Promise<Page<T>> {
        const pageData = await this.getData(queryBuilder);
        const pageMeta = await this.getMeta(queryBuilder, pageOptions);
        return new Page(pageData, pageMeta);
    }
}
