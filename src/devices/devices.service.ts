import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async create(createDeviceDto: CreateDeviceDto) {
    const profile = await this.profileRepository.findOneBy({ id: createDeviceDto.profile });
    if (!profile) throw new NotFoundException(`Profile #${createDeviceDto.profile} not found`);

    const device = this.deviceRepository.create({
      ...createDeviceDto,
      profile,
    });
    return await this.deviceRepository.save(device);
  }

  async findAll() {
    return await this.deviceRepository.find({
      relations: ['profile'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!device) throw new NotFoundException(`Device #${id} not found`);
    return device;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    const devices = await this.findOne(id);
    const { profile } = updateDeviceDto;

    if (profile) {
      const existsProfile = await this.profileRepository.findOne({ where: { id: profile } });
      if (!existsProfile) throw new NotFoundException("Bunday profil tarmoqda mavjud emas ❌");
    }

    Object.assign(devices, updateDeviceDto);
    return this.deviceRepository.save(devices);
  }

  async remove(id: number) {
    const result = await this.deviceRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Device #${id} not found`);
    return { message: `Device #${id} deleted successfully` };
  }
}