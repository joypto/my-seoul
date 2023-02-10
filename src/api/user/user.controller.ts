import { Controller, Get, Param, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/authUser.decorator';
import { PageOption } from '../common/page/option.dto';
import { BookmarkService } from '../my-bookmark/bookmark.service';
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
        private readonly bookmarkService: BookmarkService
    ) {}

    @Get('/me')
    async findMe(@AuthUser() user: User) {
        return this.userService.findOneById(user.id);
    }

    @Get('/:id/bookmarks')
    async getBookmarkedCollections(@Param('id') id: number, @Query() pageOptions: PageOption) {
        return await this.bookmarkService.findCollections(id, pageOptions);
    }
}
