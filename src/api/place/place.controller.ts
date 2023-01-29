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
import { User } from '../user/user.entity';
import { CreatePlaceDto } from './dto/createPlace.dto';
import { ReadPlaceDto } from './dto/readPlace.dto';
import { UpdatePlaceDto } from './dto/updatePlace.dto';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Controller('places')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Place')
@ApiBearerAuth('JWT')
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    @Post()
    @ApiOperation({ summary: 'create my place' })
    async create(@Body() dto: CreatePlaceDto): Promise<Place> {
        return await this.placeService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'get places' })
    async get(@Query() dto: ReadPlaceDto): Promise<Page<Place>> {
        if (dto.collectionId)
            return await this.placeService.findByCollectionId(dto.collectionId, dto.pageOptions);
        return await this.placeService.findAll(dto.pageOptions);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'get place by id' })
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Place> {
        return await this.placeService.findOneById(id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'update my place' })
    async updateOneById(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePlaceDto
    ): Promise<Place> {
        return await this.placeService.updateOneMine(user, id, dto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'delete my place' })
    async deleteOneById(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        await this.placeService.deleteOneMine(user, id);
    }
}
