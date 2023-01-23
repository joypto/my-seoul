import {
    Body,
    Controller,
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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { AuthUser } from '../auth/auth-user.decorator';
import { PageOptionDto } from '../common/dto/page-option.dto';
import { PageDto } from '../common/dto/page.dto';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionReqDto } from './dto/collection-req.dto';
import { CollectionDto } from './dto/basic.dto';

@Controller('collections')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Collection')
@ApiBearerAuth('JWT')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Post()
    @ApiOperation({ summary: 'create my collection' })
    async create(@AuthUser() user: User, @Body() dto: CollectionDto): Promise<Collection> {
        return await this.collectionService.create(user, dto);
    }

    @Get()
    @ApiOperation({ summary: 'get all collections' })
    async get(@Query() dto: CollectionReqDto): Promise<PageDto<Collection>> {
        if (dto.authorId)
            return await this.collectionService.findByUserId(dto.authorId, dto.pageOptions);
        return await this.collectionService.findAll(dto.pageOptions);
    }

    @Get('/me')
    @ApiOperation({ summary: 'get my collections' })
    async getMine(
        @AuthUser() user: User,
        @Query() pageOptions: PageOptionDto
    ): Promise<PageDto<Collection>> {
        return await this.collectionService.findByUserId(user.id, pageOptions);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'get collections by id' })
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Collection> {
        return await this.collectionService.findOneById(id);
    }
}
