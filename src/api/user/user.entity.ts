import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { Bookmark } from '../bookmark/bookmark.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../admin/role/role.enum';

@Entity()
export class User extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refreshToken?: string | null;

    @Column('enum', { enum: Role, default: [Role.USER] })
    roles: Role[];

    // user can write user's collections
    @OneToMany(() => Collection, (collection) => collection.author, {
        eager: false,
        nullable: true
    })
    collections: Collection[] | null;

    // user can bookmark collections
    @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { eager: false, nullable: true })
    bookmarks: Bookmark[] | null;
}
