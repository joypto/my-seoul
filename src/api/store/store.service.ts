import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// 지도 상가 표기 및 검색 시 자동 완성을 위함
@Injectable()
export class StoreService {
    constructor(private readonly configService: ConfigService) {}

    async test() {
        const serviceKey = this.configService.get('SERVICE_KEY');

        // 2. 반경 내 상권 조회
        // const response = await axios.get(
        //     `http://apis.data.go.kr/B553077/api/open/sdsc2/storeZoneInRadius?radius=500&cx=127.004528&cy=37.567538&serviceKey=${serviceKey}&type=json`
        // );

        // 8. 행정동 단위 상가 업소 조회
        const response = await axios.get(
            `http://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong?divId=ctprvnCd&key=11&indsMclsCd=Q12&indsSclsCd=Q12A01&divId=ctprvnCd&pageNo=1&numOfRows=10&serviceKey=${serviceKey}&type=json`
        );

        console.log(response.data.body.items);
    }
}
