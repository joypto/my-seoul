import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
    @Get()
    @ApiOperation({ summary: 'health check' })
    checkHealth() {
        return;
    }
}
