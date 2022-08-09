import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Item } from '../entities/item.entity';
import {
  CreateItemDto,
  UpdateItemDto,
  CreateItemByUserDto,
  UpdateItemByUserDto,
} from '../dtos/item.dto';
import { CategoriesService } from './categories.service';
import { UsersService } from './../../users/services/users.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepo: Repository<Item>,
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

  async findAllByUser(userId: number) {
    const items = await this.itemRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return items;
  }

  async findOne(id: number) {
    const item = await this.itemRepo.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        user: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return item;
  }

  async findOneByUser(id: number, userId: number) {
    const item = await this.findOne(id);

    if (item.user === null || item.user.id !== userId) {
      throw new UnauthorizedException(
        `This Item dont belong to this user: item.user: ${item.user.id}, userId: ${userId}`,
      );
    }

    return item;
  }

  async create(payload: CreateItemDto) {
    const user = await this.usersService.findOne(payload.userId);

    if (payload.categoryId) {
      const category = await this.categoriesService.findOne(payload.categoryId);

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

      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const newItem = queryRunner.manager.create(Item, payload);
    newItem.user = user;

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

    return await this.findOne(newItem.id);
  }

  async createByUser(payload: CreateItemByUserDto, userId: number) {
    const user = await this.usersService.findOne(userId);

    const payloadWithUser = {
      ...payload,
      userId,
    };

    if (payload.categoryId) {
      const category = await this.categoriesService.findOne(payload.categoryId);

      if (category.user.id !== userId) {
        throw new UnauthorizedException(
          `This category do not belong to this user: userId: ${userId}, category.user.id: ${category.user.id}`,
        );
      }

      const queryRunner = this.dataSource.createQueryRunner();
      const newItem = queryRunner.manager.create(Item, payloadWithUser);
      newItem.category = category;
      newItem.user = user;

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

      return await this.findOne(newItem.id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const newItem = queryRunner.manager.create(Item, payloadWithUser);
    newItem.user = user;

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

    return await this.findOne(newItem.id);
  }

  async update(id: number, changes: UpdateItemDto) {
    const item = await this.findOne(id);

    if (changes.userId) {
      const user = await this.usersService.findOne(changes.userId);

      if (changes.categoryId) {
        const category = await this.categoriesService.findOne(
          changes.categoryId,
        );

        if (!category.user) {
          throw new NotFoundException(`This category doesnt have a user`);
        }

        if (user.id === category.user.id) {
          const queryRunner = this.dataSource.createQueryRunner();
          const editedItem = queryRunner.manager.merge(Item, item, changes);
          editedItem.user = user;
          editedItem.category = category;

          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
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

        throw new BadRequestException(
          `User id and Category user id are not the same: user.id: ${user.id}, category.user.id: ${category.user.id}`,
        );
      }
      const queryRunner = this.dataSource.createQueryRunner();
      const editedItem = queryRunner.manager.merge(Item, item, changes);
      editedItem.user = user;

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
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

    if (changes.categoryId) {
      const category = await this.categoriesService.findOne(changes.categoryId);

      const queryRunner = this.dataSource.createQueryRunner();
      const editedItem = queryRunner.manager.merge(Item, item, changes);
      editedItem.category = category;

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
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

    const queryRunner = this.dataSource.createQueryRunner();
    const editedItem = queryRunner.manager.merge(Item, item, changes);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

  async updateByUser(id: number, changes: UpdateItemByUserDto, userId: number) {
    const item = await this.findOneByUser(id, userId);

    if (changes.categoryId) {
      const category = await this.categoriesService.findOneByUser(
        changes.categoryId,
        userId,
      );

      const queryRunner = this.dataSource.createQueryRunner();
      const editedItem = queryRunner.manager.merge(Item, item, changes);
      editedItem.category = category;

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(Item, editedItem);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error);
      } finally {
        await queryRunner.release();
      }

      return await this.findOneByUser(id, userId);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const editedItem = queryRunner.manager.merge(Item, item, changes);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Item, editedItem);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return await this.findOneByUser(id, userId);
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

  async deleteByUser(id: number, userId: number) {
    await this.findOneByUser(id, userId);

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
