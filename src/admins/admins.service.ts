import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminRoles } from '../common/enum/admin-roles';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>
  ) { }

  async onModuleInit() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = String(process.env.SUPER_ADMIN_NAME) || "Jorabek";
    const phone = String(process.env.SUPER_ADMIN_PHONE) || "+998500406088";

    if (!email || !password) return;

    const existSuperAdmin = await this.adminRepo.findOne({ where: { email } });

    if (!existSuperAdmin) {
      const hashedPassword = await bcrypt.hash(password, 7);
      await this.adminRepo.create({
        email,
        password: hashedPassword,
        full_name: name,
        is_active: true,
        role: AdminRoles.SUPERADMIN
      });
      console.log(`Superadmin yaratildi: "email": ${email} || "password": ${password}`);
    }
  }

  async findAdminByEmail(email: string) {
    const user = await this.adminRepo.findOne({
      where: { email },
    });
    return user;
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, password } = createAdminDto;
    const existEmail = await this.findAdminByEmail(email);
    if (existEmail) throw new BadRequestException("Bunday email band ❗️");
    createAdminDto.password = await bcrypt.hash(password, 7);

    const newAdmin = this.adminRepo.create(createAdminDto);
    return await this.adminRepo.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepo.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException("Bunday ID da admin topilmadi ❌");

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const { email, password } = updateAdminDto;
    const admin = await this.adminRepo.findOne({ where: { id } });

    if (!admin) throw new NotFoundException("Bunday ID da Admin topilmadi ❌");

    if (email) {
      const existEmail = await this.findAdminByEmail(email);
      if (existEmail && existEmail.id != id) throw new BadRequestException("Bunday email band ❗️");
    }
    if (password) {
      updateAdminDto.password = await bcrypt.hash(password, 7);
    }

    Object.assign(admin, updateAdminDto);
    return await this.adminRepo.save(admin);
  }

  async remove(id: number) {
    const deletedAdmin = await this.adminRepo.delete(id);
    if (deletedAdmin.affected === 0) throw new NotFoundException("Bunday ID da Admin topilmadi ❌");
    return {
      message: "Admin deleted successfully ✅"
    }
  }
}
