import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { User } from '../user/user.entity';

@Entity()
export class Place extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string | null;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    collectionId: number;

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
