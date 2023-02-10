import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkModule } from '../my-bookmark/bookmark.module';
import { User } from '../user/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([User]), BookmarkModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
