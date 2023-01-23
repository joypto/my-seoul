import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { AbstractEntity } from '../common/abstract.entity';

@Entity()
export class User extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken?: string | null;

    // user can own collections
    @OneToMany(() => Collection, (collection) => collection.author, {
        eager: false,
        nullable: true
    })
    collections: Collection[] | null;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}
