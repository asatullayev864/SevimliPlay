import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity({ name: 'plans' })
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 10, default: 'USD' })
    currency: string;

    @Column({ type: 'varchar', length: 50 })
    billing_period: string;

    @Column({ type: 'varchar', length: 50 })
    video_quality: string;

    @Column({ type: 'int', default: 1 })
    max_profiles: number;

    @Column({ type: 'int', default: 1 })
    concurrent_streams: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    @OneToMany(() => Subscription, (subscription) => subscription.plan)
    subscriptions: Subscription[];
}