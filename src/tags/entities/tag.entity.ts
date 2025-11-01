import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ContentTag } from '../../content-tags/entities/content-tag.entity';

@Entity({ name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    @OneToMany(() => ContentTag, (contentTag) => contentTag.tag)
    contentTags: ContentTag[];
}