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
import { PageOption } from '../common/page/option.dto';
import { Page } from '../common/page/page.dto';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { UpdateCollectionDto } from './dto/updateCollection.dto';
import { ReadCollectionDto } from './dto/readCollection.dto';
import { CreateCollectionDto } from './dto/createCollection.dto';

@Controller('collections')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Collection')
@ApiBearerAuth('JWT')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Post()
    @ApiOperation({ summary: 'create collection' })
    async create(@AuthUser() user: User, @Body() dto: CreateCollectionDto): Promise<Collection> {
        return await this.collectionService.create(user, dto);
    }

    @Get()
    @ApiOperation({ summary: 'get collections' })
    async get(@Query() dto: ReadCollectionDto): Promise<Page<Collection>> {
        if (dto.authorId)
            return await this.collectionService.findByUserId(dto.authorId, dto.pageOptions);
        return await this.collectionService.findAll(dto.pageOptions);
    }

    @Get('/me')
    @ApiOperation({ summary: 'get collections created by me' })
    async getMine(
        @AuthUser() user: User,
        @Query() pageOptions: PageOption
    ): Promise<Page<Collection>> {
        return await this.collectionService.findByUserId(user.id, pageOptions);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'get collection by id' })
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Collection> {
        return await this.collectionService.findOneById(id);
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
}
