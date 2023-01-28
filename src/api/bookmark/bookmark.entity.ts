import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { User } from '../user/user.entity';

@Entity()
export class Bookmark extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ select: false })
    userId: number; // for get userId without join

    @ManyToOne(() => User, (user) => user.bookmarks, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ select: false })
    collectionId: number; // for get collectionId without join

    @ManyToOne(() => Collection, (collection) => collection.bookmarks, { eager: false })
    @JoinColumn({ name: 'collectionId' })
    collection: Collection;
}
