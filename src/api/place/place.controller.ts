import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { PlaceDto } from './dto/basic.dto';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Controller('place')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Place')
@ApiBearerAuth('JWT')
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    @Post()
    async create(@AuthUser() user: User, @Body() dto: PlaceDto): Promise<Place> {
        return await this.placeService.create(dto);
    }
}
