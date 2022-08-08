import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsController } from './controllers/items.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ItemsService } from './services/items.service';
import { CategoriesService } from './services/categories.service';
import { Item } from './entities/item.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  controllers: [ItemsController, CategoriesController],
  providers: [ItemsService, CategoriesService],
  exports: [ItemsService, CategoriesService, TypeOrmModule],
})
export class ItemsModule {}
