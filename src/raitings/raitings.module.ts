import { Module } from '@nestjs/common';
import { RaitingsService } from './raitings.service';
import { RaitingsController } from './raitings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raiting } from './entities/raiting.entity';
import { Content } from '../contents/entities/content.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raiting, Content, Profile])],
  controllers: [RaitingsController],
  providers: [RaitingsService],
})
export class RaitingsModule {}
