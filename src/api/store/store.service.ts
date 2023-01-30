import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StoreService {
    constructor(private readonly configService: ConfigService) {}

    async test() {
        const serviceKey = this.configService.get('SERVICE_KEY');

        const response = await axios.get(
            `http://apis.data.go.kr/B553077/api/open/sdsc2/storeZoneOne?key=9174&serviceKey=${serviceKey}&type=json`
        );
        console.log(response.data.body.items);
    }
}
