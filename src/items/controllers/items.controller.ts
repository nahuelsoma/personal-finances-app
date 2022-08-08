import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ItemsService } from '../services/items.service';
import { CreateItemDto, UpdateItemDto } from '../dtos/item.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all items' })
  getAll() {
    return this.itemsService.findAll();
  }

  @Get('all/:id')
  @ApiOperation({ summary: 'Get a single item by id' })
  get(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  // @Post()
  // @ApiOperation({
  //   summary: 'Create a new item',
  // })
  // create(@Body() payload: CreateItemDto) {
  //   return this.itemsService.create(payload);
  // }

  @Put(':id')
  @ApiOperation({
    summary: 'Edit an existing item',
  })
  edit(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateItemDto) {
    return this.itemsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing item',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.delete(id);
  }
}
