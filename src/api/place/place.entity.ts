import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { AbstractEntity } from '../common/abstract.entity';

@Entity()
export class Place extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string | null;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column({ nullable: true })
    address: string | null;

    @Column()
    collectionId: number; // for get collectionId without join

    @ManyToOne(() => Collection, (collection) => collection.places, { eager: false })
    @JoinColumn({ name: 'collectionId' })
    collection: Collection;

    constructor(
        name: string,
        description: string,
        latitude: number,
        longitude: number,
        collection: Collection
    ) {
        super();
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.collection = collection;
    }
}
