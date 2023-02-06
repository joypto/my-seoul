import { Module } from '@nestjs/common';
import { HitsController } from './hits.controller';
import { HitsService } from './hits.service';

@Module({
    imports: [],
    controllers: [HitsController],
    providers: [HitsService],
    exports: [HitsService]
})
export class HitsModule {}
