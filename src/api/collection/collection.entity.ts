import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { Place } from '../place/place.entity';
import { User } from '../user/user.entity';

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

    isAuthor(userId: number): boolean {
        return userId === this.authorId;
    }
}
