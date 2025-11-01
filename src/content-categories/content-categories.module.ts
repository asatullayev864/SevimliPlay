import { Module } from '@nestjs/common';
import { ContentCategoriesService } from './content-categories.service';
import { ContentCategoriesController } from './content-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCategory } from './entities/content-category.entity';
import { Content } from '../contents/entities/content.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCategory, Content, Category])],
  controllers: [ContentCategoriesController],
  providers: [ContentCategoriesService],
})
export class ContentCategoriesModule { }
