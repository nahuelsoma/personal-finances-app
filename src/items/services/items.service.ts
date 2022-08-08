import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Item } from '../entities/item.entity';
import { CreateItemDto, UpdateItemDto } from '../dtos/item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemsRepo: Repository<Item>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const items = await this.itemsRepo.find();
    items.sort((a, b) => {
      return a.id - b.id;
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemsRepo.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Item id: ${id} not found`);
    }
    return item;
  }

  async findItemsByUser(userId: number) {
    const items = await this.itemsRepo.find({
      where: {
        user: { id: userId },
      },
    });
    items.sort((a, b) => {
      return b.id - a.id;
    });
    return items;
  }

  async create(payload: CreateItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newItem = queryRunner.manager.create(Item, payload);
      await queryRunner.manager.save(Item, newItem);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    const createdItem = await this.itemsRepo.findOneBy({
      name: payload.name,
    });
    if (!createdItem) {
      throw new ConflictException(`Item '${payload.name}' was not created`);
    }
    return {
      messaje: `${payload.name} created successfully`,
    };
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

  async remove(id: number) {
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
