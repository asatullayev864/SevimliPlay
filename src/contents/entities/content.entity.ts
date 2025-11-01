import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ContentTypes, ContentLanguage, ContentMaturityLevel } from "../../common/enum/content.enums";
import { ContentTag } from "../../content-tags/entities/content-tag.entity";
import { ContentCategory } from "../../content-categories/entities/content-category.entity";

@Entity("contents")
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ContentTypes
    })
    type: ContentTypes;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "date" })
    release_date: string;

    @Column({
        type: "enum",
        enum: ContentLanguage
    })
    language: ContentLanguage;

    @Column({ type: "varchar", length: 100 })
    country: string;

    @Column({ type: "int" })
    duration_minutes: number;

    @Column({
        type: "enum",
        enum: ContentMaturityLevel
    })
    maturity_level: ContentMaturityLevel;

    @Column({ type: "boolean", default: true })
    is_published: boolean;

    @Column({ type: "varchar", length: 500, nullable: true })
    trailer_url: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @OneToMany(() => ContentTag, (contentTag) => contentTag.content)
    contentTags: ContentTag[];

    @OneToMany(() => ContentCategory, (contentCategory) => contentCategory.content)
    contentCategories: ContentCategory[];
}