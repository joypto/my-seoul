import { Controller, Get } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get('/test')
    async test() {
        await this.storeService.test();
    }
}
