import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }

  async create(createProfileDto: CreateProfileDto) {
    const { userId } = createProfileDto;

    const userData = await this.userRepo.findOne({ where: { id: userId } })
    if (!userData) {
      throw new NotFoundException("User id not found")
    }

    const profiles = this.profileRepo.create({
      ...createProfileDto, 
      user: userData
    })

    return this.profileRepo.save(profiles)
  }

  findAll() {
    return this.profileRepo.find({ relations: ['user'], order: { id: 'DESC' } })
  }

  async findOne(id: number) {
    const profile = await this.profileRepo.findOne({ where: { id }, relations: ['user'] })
    if (!profile) {
      throw new NotFoundException("Bunday id mavjud emas")
    }
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepo.findOneBy({ id })
    if (!profile) {
      throw new NotFoundException("Bunday id mavjud emas")
    }

    const { userId, ...rest } = updateProfileDto;

    if (userId) {
      const userData = await this.userRepo.findOne({ where: { id: userId } })
      if (!userData) {
        throw new NotFoundException("User id not found")
      }

      profile.user = userData;
    }

    Object.assign(profile, rest);

    return this.profileRepo.save(profile);
  }

  async remove(id: number) {
    const profiles = await this.profileRepo.delete({ id });
    if (profiles.affected === 0) {
      throw new NotFoundException('profiles not found')
    }
    return { message: "id o'chirildi" }
  }
}