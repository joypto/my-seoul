import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceController } from './place.controller';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Place])],
    controllers: [PlaceController],
    providers: [PlaceService],
    exports: [PlaceService]
})
export class PlaceModule {}
