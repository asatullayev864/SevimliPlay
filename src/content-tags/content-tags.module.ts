import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentTagsService } from './content-tags.service';
import { ContentTag } from './entities/content-tag.entity';
import { Content } from '../contents/entities/content.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentTag, Content, Tag])],
  providers: [ContentTagsService],
  exports: [ContentTagsService],
})
export class ContentTagsModule { }