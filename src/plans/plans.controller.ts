import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { AdminRoles } from '../common/enum/admin-roles';
import { RolesGuard } from '../common/guard/role.guard';

@Controller('plans')
@UseGuards(AuthGuard, RolesGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Roles(AdminRoles.SUPERADMIN)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Roles('public')
  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }

  @Roles(AdminRoles.ADMIN, AdminRoles.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(+id, updatePlanDto);
  }

  @Roles(AdminRoles.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(+id);
  }
}