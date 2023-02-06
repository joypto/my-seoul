import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/authUser.decorator';
import { UsernameDto } from '../auth/dto/auth.dto';
import { CollectionService } from '../my-collection/collection.service';
import { PlaceService } from '../my-place/place.service';
import { User } from '../user/user.entity';
import { AdminService } from './admin.service';
import { CodeDto } from './dto/code.dto';
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
        private readonly adminService: AdminService,
        private readonly collectionService: CollectionService,
        private readonly placeService: PlaceService
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'give permission to update admin role' })
    async giveRole(@Body() dto: UsernameDto): Promise<void> {
        await this.adminService.giveRole(dto.username);
    }

    @Patch()
    @ApiOperation({ summary: 'update to admin role' })
    async takeRole(@AuthUser() user: User, @Body() dto: CodeDto): Promise<User> {
        return await this.adminService.takeRole(user, dto.code);
    }

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
