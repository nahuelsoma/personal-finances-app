import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { CategoriesService } from '../../items/services/categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../items/dtos/category.dto';
import { CreateItemDto, UpdateItemDto } from '../../items/dtos/item.dto';
import { ItemsService } from '../../items/services/items.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
  ) {}

  @Roles(Role.USER)
  @Get('categories')
  getCategories(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.categoriesService.categoriesByUser(user.sub);
  }

  @Roles(Role.USER)
  @Put('categories')
  createCategory(@Req() req: Request, @Body() payload: CreateCategoryDto) {
    const user = req.user as PayloadToken;
    return this.categoriesService.create(payload, user.sub);
  }

  @Roles(Role.USER)
  @Get('items')
  getItems(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.itemsService.findItemsByUser(user.sub);
  }

  @Roles(Role.USER)
  @Put('items')
  createItem(@Req() req: Request, @Body() payload: CreateItemDto) {
    const user = req.user as PayloadToken;
    return this.itemsService.create(payload, user.sub);
  }
}
