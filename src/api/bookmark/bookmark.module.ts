import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from './bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Bookmark])],
    controllers: [BookmarkController],
    providers: [BookmarkService],
    exports: [BookmarkService]
})
export class BookmarkModule {}
