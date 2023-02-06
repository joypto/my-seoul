import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { ONE_DAY } from 'src/constants/consts';
import { COLLECTION_HITS_CHECKER } from 'src/redis/redis.key';
import { RedisService } from 'src/redis/redis.service';
import { DataSource } from 'typeorm';
import { Collection } from '../my-collection/collection.entity';
import { User } from '../user/user.entity';
import { Hits } from './hits.entity';

@Injectable()
export class HitsService {
    constructor(
        private readonly redisService: RedisService,
        private readonly dataSource: DataSource
    ) {}

    private async isDuplicateHits(userId: number, collectioinId: number): Promise<boolean> {
        const exists = await this.redisService.exists(
            COLLECTION_HITS_CHECKER(collectioinId, userId)
        );
        return exists >= 1;
    }

    // increase hits count
    async hits(user: User, collectionId: number): Promise<void> {
        if (await this.isDuplicateHits(user.id, collectionId)) return;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            // save hits
            await queryRunner.manager.save(
                Hits,
                Builder(Hits).userId(user.id).collectionId(collectionId).build()
            );
            // update hits count
            await queryRunner.manager
                .createQueryBuilder()
                .update(Collection)
                .where('id = :collectionId', { collectionId })
                .set({ hitCount: () => 'hitCount + 1' })
                .execute();
            await queryRunner.commitTransaction();
        } catch (err) {
            console.error(err);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        // set checker
        await this.redisService.setex(COLLECTION_HITS_CHECKER(collectionId, user.id), ONE_DAY, 1);
    }
}
