import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentCategoryDto } from './dto/create-content-category.dto';
import { UpdateContentCategoryDto } from './dto/update-content-category.dto';
import { ContentCategory } from './entities/content-category.entity';
import { Content } from '../contents/entities/content.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ContentCategoriesService {
  constructor(
    @InjectRepository(ContentCategory)
    private readonly contentCategoryRepo: Repository<ContentCategory>,

    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async create(createContentCategoryDto: CreateContentCategoryDto) {
    const { contentId, categoryId } = createContentCategoryDto;

    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');

    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const contentCategory = this.contentCategoryRepo.create({
      content,
      category,
    });

    return this.contentCategoryRepo.save(contentCategory);
  }

  findAll() {
    return this.contentCategoryRepo.find({
      relations: ['content', 'category'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const contentCategory = await this.contentCategoryRepo.findOne({
      where: { id },
      relations: ['content', 'category'],
    });
    if (!contentCategory) throw new NotFoundException('ContentCategory not found');
    return contentCategory;
  }

  async update(id: number, updateDto: UpdateContentCategoryDto) {
    const contentCategory = await this.contentCategoryRepo.findOne({ where: { id } });
    if (!contentCategory) throw new NotFoundException('ContentCategory not found');

    const { contentId, categoryId } = updateDto;

    if (contentId) {
      const content = await this.contentRepo.findOne({ where: { id: contentId } });
      if (!content) throw new NotFoundException('Content not found');
      contentCategory.content = content;
    }

    if (categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (!category) throw new NotFoundException('Category not found');
      contentCategory.category = category;
    }

    return this.contentCategoryRepo.save(contentCategory);
  }

  async remove(id: number) {
    const result = await this.contentCategoryRepo.delete({ id });
    if (result.affected === 0) throw new NotFoundException('ContentCategory not found');
    return { message: 'Deleted successfully' };
  }
}