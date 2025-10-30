import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existEmail = await this.findUserByEmail(createUserDto.email);
    if (existEmail) {
      throw new BadRequestException("Bunday email mavjud, iltimos boshqa email kiriting ❗️");
    }
    const user = this.userRepo.create({
      ...createUserDto,
      is_email_verified: true,
    });
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("Bunday user topilmadi ❌");
    }
    if (updateUserDto.email) {
      const existEmail = await this.findUserByEmail(updateUserDto.email);
      if (existEmail && existEmail.email != user.email) {
        throw new BadRequestException("Bunday email band ❗️");
      }
    }
    await this.userRepo.update(id, updateUserDto);
    return await this.userRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found ❌`);
    }
    return { message: `User with id ${id} deleted successfully ✅` };
  }
}
