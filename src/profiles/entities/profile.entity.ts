import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Language, MaturityLevel } from '../../common/enum/profile.enums';
import { User } from '../../users/entities/user.entity';
import { Device } from '../../devices/entities/device.entity';
import { Raiting } from '../../raitings/entities/raiting.entity';

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.profileId, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    display_name: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({
        type: 'enum',
        enum: Language,
        default: Language.UZ,
    })
    language: Language;

    @Column({
        type: 'enum',
        enum: MaturityLevel,
        default: MaturityLevel.ZERO_PLUS,
    })
    maturity_level: MaturityLevel;

    @Column({ default: false })
    is_default: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Device, (device) => device.profile)
    devices: Device[];

    @OneToMany(() => Raiting, (raiting) => raiting.profile)
    raiting: Raiting[];
}