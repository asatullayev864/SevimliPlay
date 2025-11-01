import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { subscriptions } from '../../common/enum/subscription.enum';

@Entity({ name: 'subscriptions' })
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;

    @ManyToOne(() => Plan, (plan) => plan.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column()
    plan_id: number;

    @Column({ type: 'varchar', length: 50, default: subscriptions.active })
    status: subscriptions;

    @Column({ type: 'timestamp with time zone' })
    start_date: Date;

    @Column({ type: 'timestamp with time zone' })
    end_date: Date;

    @Column({ type: 'boolean', default: true })
    auto_renew: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}