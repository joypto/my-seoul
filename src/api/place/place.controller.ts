import { Controller, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';

@Controller('place')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Place')
@ApiBearerAuth('JWT')
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}
}
