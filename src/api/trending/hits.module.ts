import { Module } from '@nestjs/common';
import { HitsService } from './hits.service';

@Module({
    imports: [],
    providers: [HitsService],
    exports: [HitsService]
})
export class HitsModule {}
