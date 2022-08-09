import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { CategoriesService } from '../../items/services/categories.service';
import {
  CreateCategoryByUserDto,
  UpdateCategoryByUserDto,
} from '../../items/dtos/category.dto';
import {
  CreateItemByUserDto,
  UpdateItemByUserDto,
} from '../../items/dtos/item.dto';
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
  getAllCategories(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.categoriesService.findAllByUser(user.sub);
  }

  @Roles(Role.USER)
  @Get('/categories/:id')
  getCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.categoriesService.findOneByUser(id, user.sub);
  }

  @Roles(Role.USER)
  @Post('categories')
  createCategory(
    @Req() req: Request,
    @Body() payload: CreateCategoryByUserDto,
  ) {
    const user = req.user as PayloadToken;
    return this.categoriesService.createByUser(payload, user.sub);
  }

  @Roles(Role.USER)
  @Put('/categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() payload: UpdateCategoryByUserDto,
  ) {
    const user = req.user as PayloadToken;
    return this.categoriesService.updateByUser(id, payload, user.sub);
  }

  @Roles(Role.USER)
  @Delete('/categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.categoriesService.deleteByUser(id, user.sub);
  }

  @Roles(Role.USER)
  @Get('items')
  getAllItems(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.itemsService.findAllByUser(user.sub);
  }

  @Roles(Role.USER)
  @Get('/items/:id')
  getItem(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.itemsService.findOneByUser(id, user.sub);
  }

  @Roles(Role.USER)
  @Post('items')
  createItem(@Req() req: Request, @Body() payload: CreateItemByUserDto) {
    const user = req.user as PayloadToken;
    return this.itemsService.createByUser(payload, user.sub);
  }

  @Roles(Role.USER)
  @Put('/items/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() payload: UpdateItemByUserDto,
  ) {
    const user = req.user as PayloadToken;
    return this.itemsService.updateByUser(id, payload, user.sub);
  }

  @Roles(Role.USER)
  @Delete('/items/:id')
  deleteItem(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.itemsService.deleteByUser(id, user.sub);
  }
}
