import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Content } from '../../contents/entities/content.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'content_categories' })
export class ContentCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Content, (content) => content.contentCategories, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'content_id' })
    content: Content;

    @ManyToOne(() => Category, (category) => category.contentCategories, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;
}