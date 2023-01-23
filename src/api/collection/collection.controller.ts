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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
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
    async get(@Query() query: { authorId: number }): Promise<Collection[]> {
        if (query.authorId) return await this.collectionService.findByUserId(query.authorId);
        return await this.collectionService.findAll();
    }

    @Get('/me')
    @ApiOperation({ summary: 'get my collections' })
    async getMine(@AuthUser() user: User): Promise<Collection[]> {
        return await this.collectionService.findByUserId(user.id);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'get collections by id' })
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Collection> {
        return await this.collectionService.findOneById(id);
    }
}
