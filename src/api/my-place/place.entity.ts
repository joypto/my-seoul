import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../my-collection/collection.entity';
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
}
