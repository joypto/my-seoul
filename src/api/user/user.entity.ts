import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { Place } from '../place/place.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken?: string | null;

    // user can own collections
    @OneToMany(() => Collection, (collection) => collection.user, { eager: false, nullable: true })
    collections: Collection[];

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}
