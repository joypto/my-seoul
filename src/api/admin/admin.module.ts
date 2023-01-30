import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SMTPModule } from 'src/smtp/smtp.module';
import { CollectionModule } from '../collection/collection.module';
import { PlaceModule } from '../place/place.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RolesGuard } from './role/role.guard';

@Module({
    imports: [ConfigModule, SMTPModule, UserModule, CollectionModule, PlaceModule],
    controllers: [AdminController],
    providers: [
        AdminService,
        // register roles guard for check admin account
        {
            provide: 'ROLES_GUARD',
            useClass: RolesGuard
        }
    ]
})
export class AdminModule {}
