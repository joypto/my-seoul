import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
    @Get('health')
    @ApiOperation({ summary: 'health check' })
    checkHealth() {
        return;
    }
}
