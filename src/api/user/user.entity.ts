import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { Bookmark } from '../bookmark/bookmark.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    @Exclude()
    password: string;

    @Column({ nullable: true, select: false })
    @Exclude()
    refreshToken?: string | null;

    // user can write user's collections
    @OneToMany(() => Collection, (collection) => collection.author, {
        eager: false,
        nullable: true
    })
    collections: Collection[] | null;

    // user can bookmark collections
    @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { eager: false, nullable: true })
    bookmarks: Bookmark[] | null;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}
