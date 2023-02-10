import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrendingDto } from './dto/trending.dto';
import { Hits } from './hits.entity';
import { HitsService } from './hits.service';

@Controller('trendings')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Hits')
@ApiBearerAuth('JWT')
export class HitsController {
    constructor(private readonly hitsService: HitsService) {}

    @Get('/collections')
    async getTrendingCollections(@Query() dto: TrendingDto): Promise<Hits[]> {
        return this.hitsService.mostHitCollections(dto.duration, dto.limit);
    }
}
