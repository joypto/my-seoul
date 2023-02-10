import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
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
import { SearchCollectionOption } from './dto/searchCollection.dto';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/createCollection.dto';
import { ReadCollectionDto } from './dto/readCollection.dto';
import { UpdateCollectionDto } from './dto/updateCollection.dto';
import { HitsService } from '../trending/hits.service';
import { TrendingDto } from '../trending/dto/trending.dto';
import { Hits } from '../trending/hits.entity';
import { PageOption } from '../common/page/option.dto';
import { Bookmark } from '../my-bookmark/bookmark.entity';
import { BookmarkService } from '../my-bookmark/bookmark.service';

@Controller('collections')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Collection')
@ApiBearerAuth('JWT')
export class CollectionController {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly bookmarkService: BookmarkService,
        private readonly hitsService: HitsService
    ) {}

    @Post()
    @ApiOperation({ summary: 'create collection' })
    async create(@AuthUser() user: User, @Body() dto: CreateCollectionDto): Promise<Collection> {
        return await this.collectionService.create(user, dto);
    }

    @Post('/:id/bookmarks')
    @ApiOperation({ summary: 'bookmark collection' })
    async bookmark(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.bookmarkService.create(user, id);
    }

    @Get()
    @ApiOperation({ summary: 'get collections' })
    async get(@Query() dto: ReadCollectionDto): Promise<Page<Collection>> {
        if (dto.authorId)
            return await this.collectionService.findByUserId(dto.authorId, dto.serachOptions);
        return await this.collectionService.findAll(dto.serachOptions);
    }

    @Get('/me')
    @ApiOperation({ summary: 'get collections created by me' })
    async getMine(
        @AuthUser() user: User,
        @Query() options: SearchCollectionOption
    ): Promise<Page<Collection>> {
        return await this.collectionService.findByUserId(user.id, options);
    }

    @Get('/hits')
    @ApiOperation({ summary: 'get trending collections' })
    async getTrendings(@Query() dto: TrendingDto): Promise<Hits[]> {
        return this.hitsService.getTrendingCollections(dto.duration, dto.limit);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'get collection by id' })
    async getOneById(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<Collection> {
        await this.hitsService.hits(user, id);
        return await this.collectionService.findOneById(id);
    }

    @Get('/:id/bookmarks')
    @ApiOperation({ summary: 'get bookmarked users in collection' })
    async getBookmarkedUsers(
        @Param('id', ParseIntPipe) id: number,
        @Query() options: PageOption
    ): Promise<Page<Bookmark>> {
        return await this.bookmarkService.findUsers(id, options);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'update collection' })
    async updateOneById(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCollectionDto
    ): Promise<Collection> {
        return await this.collectionService.updateOne(user, id, dto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'delete collection' })
    async deleteOneById(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        await this.collectionService.deleteOneByUserId(user, id);
    }

    @Delete('/:id/bookmarks')
    @ApiOperation({ summary: 'delete my bookmark in collection' })
    async deleteMyBookmark(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        await this.bookmarkService.deleteOne(user, id);
    }
}
