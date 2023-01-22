import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Place } from '../place/place.entity';
import { User } from '../user/user.entity';

@Entity()
export class Collection extends BaseEntity {
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
    userId: number;

    @ManyToOne(() => User, (user) => user.collections, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Place, (place) => place.collection, { eager: false, nullable: true })
    places: Place[];
}
