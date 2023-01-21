import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Place extends BaseEntity {
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
    latitude: number;

    @Column()
    longitude: number;

    @ManyToOne(() => User, (user) => user.places, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    constructor(
        name: string,
        description: string,
        latitude: number,
        longitude: number,
        user: User
    ) {
        super();
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
    }
}
