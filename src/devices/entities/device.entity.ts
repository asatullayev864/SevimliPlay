import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { deviceTypes, OS } from '../../common/enum/devices.type';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity({ name: 'devices' })
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Profile, (profile) => profile.devices, { onDelete: 'CASCADE' })
    profile: Profile;

    @Column({
        type: 'enum',
        enum: deviceTypes,
    })
    device_type: deviceTypes;

    @Column()
    device_name: string;

    @Column({
        type: 'enum',
        enum: OS,
    })
    os: OS;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    last_seen_at: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}