import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) { }

  // ============ CREATE ============
  async create(createPlanDto: CreatePlanDto) {
    const newPlan = this.planRepo.create(createPlanDto);
    await this.planRepo.save(newPlan);
    return {
      message: "Tarif rejasi muvaffaqiyatli yaratildi ✅",
      plan: newPlan,
    };
  }

  // ============ FIND ALL ============
  async findAll() {
    const plans = await this.planRepo.find({
      order: { created_at: 'DESC' },
    });
    return plans;
  }

  // ============ FIND ONE ============
  async findOne(id: number) {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`ID ${id} bo'lgan plan topilmadi ❗️`);
    }
    return plan;
  }

  // ============ UPDATE ============
  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);
    const updated = Object.assign(plan, updatePlanDto); //bu yerda update() emas, balki entity obyektini yangilab uni save() orqali saqlash uchun ishlatilgan
    await this.planRepo.save(updated);
    return {
      message: "Tarif rejasi yangilandi ✅",
      plan: updated,
    };
  }

  // ============ DELETE ============
  async remove(id: number) {
    const plan = await this.findOne(id);
    await this.planRepo.remove(plan);
    return {
      message: "Tarif rejasi o'chirildi 🗑️",
      ID: id,
    };
  }
}