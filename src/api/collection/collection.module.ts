import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Collection])],
    controllers: [CollectionController],
    providers: [CollectionService],
    exports: [CollectionService]
})
export class CollectionModule {}
