import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { Place } from '../my-place/place.entity';
import { User } from '../user/user.entity';
import { Bookmark } from '../my-bookmark/bookmark.entity';

@Entity()
export class Collection extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string | null;

    @Column()
    authorId: number; // for get authorId without join

    @ManyToOne(() => User, (user) => user.collections, { eager: false })
    @JoinColumn({ name: 'authorId' })
    author: User;

    @OneToMany(() => Place, (place) => place.collection, { eager: false, nullable: true })
    places: Place[] | null;

    @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { eager: false, nullable: true })
    bookmarks: Bookmark[] | null;

    @Column({ default: 0 })
    bookmarkCount: number; // for better performance when querying bookmark count

    isAuthor(userId: number): boolean {
        return userId === this.authorId;
    }
}
