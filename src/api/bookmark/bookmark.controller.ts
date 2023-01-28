import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/authUser.decorator';
import { Page } from '../common/page/page.dto';
import { User } from '../user/user.entity';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { ReadBookmarkCollectionDto } from './dto/readBookmarkUser.dto';
import { Bookmark } from './bookmark.entity';
import { BookmarkService } from './bookmark.service';
import { ReadBookmarkUserDto } from './dto/readBookmarkCollection.dto copy';

@Controller('bookmarks')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Bookmark')
@ApiBearerAuth('JWT')
export class BookmarkController {
    constructor(private readonly bookmarkService: BookmarkService) {}

    @Post()
    @ApiOperation({ summary: 'bookmark collection' })
    async create(@AuthUser() user: User, @Body() dto: CreateBookmarkDto): Promise<void> {
        await this.bookmarkService.create(user, dto);
    }

    @Get('/collections')
    @ApiOperation({ summary: 'get bookmarked collections' })
    async getCollections(@Query() dto: ReadBookmarkCollectionDto): Promise<Page<Bookmark>> {
        return await this.bookmarkService.findCollections(dto.userId, dto.pageOptions);
    }

    @Get('/users')
    @ApiOperation({ summary: 'get users who have bookmarked the collection' })
    async getUsers(@Query() dto: ReadBookmarkUserDto): Promise<Page<Bookmark>> {
        return await this.bookmarkService.findUsers(dto.collectionId, dto.pageOptions);
    }

    @Delete('/:collectionId')
    @ApiOperation({ summary: 'cancel bookmark collection' })
    async cancel(
        @AuthUser() user: User,
        @Param('collectionId', ParseIntPipe) collectionId: number
    ): Promise<void> {
        await this.bookmarkService.deleteOne(user, collectionId);
    }
}
