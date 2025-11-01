import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRaitingDto } from './dto/create-raiting.dto';
import { UpdateRaitingDto } from './dto/update-raiting.dto';
import { Raiting } from './entities/raiting.entity';
import { Content } from '../contents/entities/content.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class RaitingsService {
  constructor(
    @InjectRepository(Raiting)
    private readonly raitingRepo: Repository<Raiting>,
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) { }

  async create(createRaitingDto: CreateRaitingDto) {
    const existContent = await this.contentRepo.findOne({ where: { id: createRaitingDto.content_id } });
    if (!existContent) throw new NotFoundException("Bunday content topilmadi ❌");

    const existProfile = await this.profileRepo.findOne({ where: { id: createRaitingDto.profile_id } });
    if (!existProfile) throw new NotFoundException("Bunday profil topilmadi ❌");

    const raiting = this.raitingRepo.create(createRaitingDto);

    return await this.raitingRepo.save(raiting);
  }

  async findAll() {
    return await this.raitingRepo.find({
      relations: ['content', 'profile'],
      order: { id: 'DESC' }
    });
  }

  async findOne(id: number) {
    const raiting = await this.raitingRepo.findOne({
      where: { id },
      relations: ['content', 'profile'],
    });
    if (!raiting) {
      throw new NotFoundException(`Raiting #${id} topilmadi`);
    }
    return raiting;
  }

  async update(id: number, updateRaitingDto: UpdateRaitingDto) {
    const raiting = await this.raitingRepo.findOne({ where: { id } });

    if (!raiting) {
      throw new NotFoundException(`Raiting #${id} topilmadi`);
    }

    if (updateRaitingDto.content_id) {
      const existContent = await this.contentRepo.findOne({ where: { id: updateRaitingDto.content_id } });
      if (!existContent) throw new NotFoundException("Bunday content topilmadi ❌");
    }

    if (updateRaitingDto.profile_id) {
      const existProfile = await this.profileRepo.findOne({ where: { id: updateRaitingDto.profile_id } });
      if (!existProfile) throw new NotFoundException("Bunday profil topilmadi ❌");
    }

    const updated = this.raitingRepo.merge(raiting, updateRaitingDto);
    return await this.raitingRepo.save(updated);
  }

  async remove(id: number) {
    const result = await this.raitingRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Raiting #${id} topilmadi`);
    }
    return { message: `Raiting #${id} o'chirildi` };
  }
}