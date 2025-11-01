import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/role.guard';
import { Roles } from '../common/decorator/roles.decorator';

@Controller('admins')
@UseGuards(AuthGuard, RolesGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  // 🔒 Faqat SUPER_ADMIN yoki ADMIN kirishi mumkin
  @Get()
  @Roles('SUPERADMIN', 'ADMIN')
  findAll() {
    return this.adminsService.findAll();
  }

  // 🔒 Faqat o‘zi (id orqali) yoki ADMIN ko‘rishi mumkin
  @Get(':id')
  @Roles('ADMIN', 'ID')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  // 🔒 Faqat o‘zi (ID) yoki SUPER_ADMIN yangilay oladi
  @Patch(':id')
  @Roles('SUPERADMIN', 'ID')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  // 🔒 Faqat SUPER_ADMIN o‘chira oladi
  @Delete(':id')
  @Roles('SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}