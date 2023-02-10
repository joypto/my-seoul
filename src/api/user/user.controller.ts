import { Controller, Get, Param, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/authUser.decorator';
import { PageOption } from '../common/page/option.dto';
import { Page } from '../common/page/page.dto';
import { Bookmark } from '../my-bookmark/bookmark.entity';
import { BookmarkService } from '../my-bookmark/bookmark.service';
import { Hits } from '../trending/hits.entity';
import { HitsService } from '../trending/hits.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('User')
@ApiBearerAuth('JWT')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly bookmarkService: BookmarkService,
        private readonly hitsService: HitsService
    ) {}

    @Get('/me')
    async findMe(@AuthUser() user: User): Promise<User> {
        return await this.userService.findOneById(user.id);
    }

    @Get('/:id')
    async findOneById(@Param('id') id: number): Promise<User> {
        return await this.userService.findOneById(id);
    }

    @Get('/me/hits')
    async getLatestHits(@AuthUser() user: User): Promise<Hits[]> {
        return await this.hitsService.getLatestViewedCollections(user.id);
    }

    @Get('/:id/bookmarks')
    async getBookmarkedCollections(
        @Param('id') id: number,
        @Query() pageOptions: PageOption
    ): Promise<Page<Bookmark>> {
        return await this.bookmarkService.findCollections(id, pageOptions);
    }
}
