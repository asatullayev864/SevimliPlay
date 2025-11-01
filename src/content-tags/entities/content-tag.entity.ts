import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Content } from '../../contents/entities/content.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity({ name: 'content_tag' })
export class ContentTag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Content, (content) => content.contentTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'contentId' })
    content: Content;

    @ManyToOne(() => Tag, (tag) => tag.contentTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'tagId' })
    tag: Tag;
}