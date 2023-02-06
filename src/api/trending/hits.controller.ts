import { Controller, Get, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Collection')
@ApiBearerAuth('JWT')
export class HitsController {}
