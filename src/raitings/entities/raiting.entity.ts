import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Content } from '../../contents/entities/content.entity';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity({ name: 'ratings' })
export class Raiting {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Content, (content) => content.raiting, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'content_id' })
    content: Content;

    @Column()
    content_id: number;

    @ManyToOne(() => Profile, (profile) => profile.raiting, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @Column()
    profile_id: number;

    @Column({ type: 'int', width: 1 })
    raiting: number;

    @Column({ type: 'text', nullable: true })
    review: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}