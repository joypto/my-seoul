import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { Collection } from '../my-collection/collection.entity';
import { User } from '../user/user.entity';

@Entity()
export class Hits extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ select: false })
    userId: number; // for get userId without join

    @ManyToOne(() => User, (user) => user.bookmarks, { eager: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ select: false })
    collectionId: number; // for get collectionId without join

    @ManyToOne(() => Collection, (collection) => collection.bookmarks, {
        eager: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'collectionId' })
    collection: Collection;
}
