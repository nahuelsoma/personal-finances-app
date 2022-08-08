import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Item } from '../entities/item.entity';
import { CreateItemDto, UpdateItemDto } from '../dtos/item.dto';
// import { Customer } from '../entities/customer.entity';
import { CategoriesService } from './categories.service';
import { UsersService } from './../../users/services/users.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepo: Repository<Item>,
    // @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    private categoriesService: CategoriesService,
    private usersService: UsersService,

    private dataSource: DataSource,
  ) {}

  async findAll() {
    const items = await this.itemRepo.find();
    items.sort((a, b) => {
      return a.id - b.id;
    });
    return items;
  }

  async findItemsByUser(userId: number) {
    await this.usersService.findOne(userId);

    const items = await this.itemRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        category: true,
      },
    });

    return items;
  }

  async findOne(id: number) {
    const item = await this.itemRepo.findOne({
      where: {
        id,
      },
    });
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return item;
  }

  async create(payload: CreateItemDto, userId: number) {
    // if (payload.categoryId) {
    //   this.categoriesService.findOneByUser(payload.categoryId, userId);
    // }

    const user = await this.usersService.findOne(userId);
    const category = await this.categoriesService.findOne(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    const newItem = queryRunner.manager.create(Item, payload);

    newItem.user = user;
    newItem.category = category;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Item, newItem);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return newItem;
  }

  async update(id: number, changes: UpdateItemDto) {
    const item = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const editedItem = queryRunner.manager.merge(Item, item, changes);
      await queryRunner.manager.save(Item, editedItem);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return await this.findOne(id);
  }

  async delete(id: number) {
    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Item, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return {
      messaje: `Item ${id} deleted`,
    };
  }
}
