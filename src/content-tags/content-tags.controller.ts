import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContentTagsService } from './content-tags.service';
import { CreateContentTagDto } from './dto/create-content-tag.dto';
import { UpdateContentTagDto } from './dto/update-content-tag.dto';

@Controller('content-tags')
export class ContentTagsController {
  constructor(private readonly contentTagsService: ContentTagsService) {}

  @Post()
  create(@Body() createContentTagDto: CreateContentTagDto) {
    return this.contentTagsService.create(createContentTagDto);
  }

  @Get()
  findAll() {
    return this.contentTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentTagDto: UpdateContentTagDto) {
    return this.contentTagsService.update(+id, updateContentTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentTagsService.remove(+id);
  }
}
