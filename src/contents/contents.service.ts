import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepo: Repository<Content>
  ) { }
  async create(createContentDto: CreateContentDto): Promise<Content> {
    const newContent = this.contentRepo.create(createContentDto);

    return newContent
  }

  async findAll(): Promise<Content[]> {
    return await this.contentRepo.find();
  }

  async findOne(id: number): Promise<Content> {
    const content = await this.contentRepo.findOne({ where: { id } });
    if (!content) throw new NotFoundException("Bunday content topilmadi ❌");

    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    return this.contentRepo.save(content);
  }

  async remove(id: number): Promise<{ message }> {
    const deletedContent = await this.contentRepo.delete(id);
    if (deletedContent.affected === 0) throw new NotFoundException("Bunday content topilmadi ❌");
    return {
      message: `Content #${id} deleted successfully`
    }
  }
}
