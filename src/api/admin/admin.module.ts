import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionModule } from '../collection/collection.module';
import { PlaceModule } from '../place/place.module';
import { AdminController } from './admin.controller';
import { RolesGuard } from './role/role.guard';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([]), CollectionModule, PlaceModule],
    controllers: [AdminController],
    providers: [
        // register roles guard for check admin account
        {
            provide: 'ROLES_GUARD',
            useClass: RolesGuard
        }
    ]
})
export class AdminModule {}
