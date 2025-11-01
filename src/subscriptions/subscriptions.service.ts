import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { User } from '../users/entities/user.entity';
import { Plan } from '../plans/entities/plan.entity';
import { subscriptions } from '../common/enum/subscription.enum';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) { }

  // ====================> CREATE <====================
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { user_id, plan_id, start_date, end_date, auto_renew } = createSubscriptionDto;

    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi ❗️');

    const plan = await this.planRepo.findOne({ where: { id: plan_id } });
    if (!plan) throw new NotFoundException('Tarif reja topilmadi ❗️');

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestException('Boshlanish sanasi tugash sanasidan oldin bo‘lishi kerak ❗️');
    }

    const subscription = this.subscriptionRepo.create({
      user,
      plan,
      start_date,
      end_date,
      auto_renew: auto_renew ?? true,
      status: subscriptions.active,
    });

    return await this.subscriptionRepo.save(subscription);
  }

  // ====================> FIND ALL <====================
  async findAll() {
    return await this.subscriptionRepo.find({
      relations: ['user', 'plan'],
      order: { created_at: 'DESC' },
    });
  }

  // ====================> FIND ONE <====================
  async findOne(id: number) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Obuna topilmadi ❗️');
    }

    return subscription;
  }

  // ====================> UPDATE <====================
  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.findOne(id);

    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepo.save(subscription);
  }

  // ====================> REMOVE <====================
  async remove(id: number) {
    const subscription = await this.findOne(id);
    await this.subscriptionRepo.remove(subscription);
    return { message: "Obuna o'chirildi ✅" };
  }
}