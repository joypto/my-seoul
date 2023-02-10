import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkModule } from '../my-bookmark/bookmark.module';
import { HitsModule } from '../trending/hits.module';
import { CollectionController } from './collection.controller';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Collection]), BookmarkModule, HitsModule],
    controllers: [CollectionController],
    providers: [CollectionService],
    exports: [CollectionService]
})
export class CollectionModule {}
