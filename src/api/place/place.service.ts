import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceDto } from './dto/basic.dto';
import { Place } from './place.entity';

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>
    ) {}

    async create(dto: PlaceDto): Promise<Place> {
        const place = this.placeRepository.create({ ...dto });
        await this.placeRepository.save(place);
        return place;
    }
}
