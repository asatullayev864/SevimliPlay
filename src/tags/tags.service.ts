import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) { }

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepo.create(createTagDto);
    return this.tagRepo.save(tag);
  }

  findAll() {
    return this.tagRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagRepo.save(tag);
  }

  async remove(id: number) {
    const result = await this.tagRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Tag not found');
    return { message: 'Tag deleted successfully' };
  }
}