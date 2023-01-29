import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/authUser.decorator';
import { CollectionService } from '../collection/collection.service';
import { PlaceService } from '../place/place.service';
import { User } from '../user/user.entity';
import { Roles } from './role/role.decorator';
import { Role } from './role/role.enum';
import { RolesGuard } from './role/role.guard';

@Controller('admin')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin')
@ApiBearerAuth('JWT')
export class AdminController {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly placeService: PlaceService
    ) {}

    // @Patch('')
    // @ApiOperation({ summary: '' })
    // async updateRole(@AuthUser() user: User): Promise<User> {

    // }

    @Delete('/collections/:collectionId')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'delete abnormal collection' })
    async deleteCollection(@Param('collectionId', ParseIntPipe) collectionId: number) {
        await this.collectionService.deleteOneById(collectionId);
    }

    @Delete('/places/:placeId')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'delete abnormal place' })
    async deletePlace(@Param('placeId', ParseIntPipe) placeId: number) {
        await this.placeService.deleteOneById(placeId);
    }
}
