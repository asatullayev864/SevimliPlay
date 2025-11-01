import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContentCategoriesService } from './content-categories.service';
import { CreateContentCategoryDto } from './dto/create-content-category.dto';
import { UpdateContentCategoryDto } from './dto/update-content-category.dto';

@Controller('content-categories')
export class ContentCategoriesController {
  constructor(private readonly contentCategoriesService: ContentCategoriesService) {}

  @Post()
  create(@Body() createContentCategoryDto: CreateContentCategoryDto) {
    return this.contentCategoriesService.create(createContentCategoryDto);
  }

  @Get()
  findAll() {
    return this.contentCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentCategoryDto: UpdateContentCategoryDto) {
    return this.contentCategoriesService.update(+id, updateContentCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentCategoriesService.remove(+id);
  }
}
