import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentTag } from './entities/content-tag.entity';
import { CreateContentTagDto } from './dto/create-content-tag.dto';
import { UpdateContentTagDto } from './dto/update-content-tag.dto';
import { Content } from '../contents/entities/content.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class ContentTagsService {
  constructor(
    @InjectRepository(ContentTag)
    private readonly contentTagRepo: Repository<ContentTag>,

    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) { }

  async create(createContentTagDto: CreateContentTagDto) {
    const { contentId, tagId } = createContentTagDto;

    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');

    const tag = await this.tagRepo.findOne({ where: { id: tagId } });
    if (!tag) throw new NotFoundException('Tag not found');

    const contentTag = this.contentTagRepo.create({
      content,
      tag,
    });

    return this.contentTagRepo.save(contentTag);
  }

  findAll() {
    return this.contentTagRepo.find({
      relations: ['content', 'tag'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const contentTag = await this.contentTagRepo.findOne({
      where: { id },
      relations: ['content', 'tag'],
    });
    if (!contentTag) throw new NotFoundException('ContentTag not found');
    return contentTag;
  }

  async update(id: number, updateDto: UpdateContentTagDto) {
    const contentTag = await this.contentTagRepo.findOne({ where: { id } });
    if (!contentTag) throw new NotFoundException('ContentTag not found');

    if (updateDto.contentId) {
      const content = await this.contentRepo.findOne({ where: { id: updateDto.contentId } });
      if (!content) throw new NotFoundException('Content not found');
      contentTag.content = content;
    }

    if (updateDto.tagId) {
      const tag = await this.tagRepo.findOne({ where: { id: updateDto.tagId } });
      if (!tag) throw new NotFoundException('Tag not found');
      contentTag.tag = tag;
    }

    return this.contentTagRepo.save(contentTag);
  }

  async remove(id: number) {
    const result = await this.contentTagRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('ContentTag not found');
    return { message: 'ContentTag deleted successfully' };
  }
}