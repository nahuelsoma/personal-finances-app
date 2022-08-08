import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from './../../users/services/users.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const categories = await this.categoryRepo.find({
      relations: {
        user: true,
        items: true,
      },
    });
    categories.sort((a, b) => {
      return a.id - b.id;
    });
    return categories;
  }

  async categoriesByUser(userId: number) {
    const categories = await this.categoryRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        items: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async findOneByUser(id: number, userId: number) {
    const user = await this.usersService.findOne(userId);

    const category = await this.categoryRepo.findOne({
      where: {
        id,
        user: user,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  // async findByEmail(email: string) {
  //   const category = this.categoryRepo.findOne({
  //     where: { email },
  //   });
  //   if (!category) {
  //     throw new NotFoundException(`Category ${email} not found`);
  //   }
  //   return category;
  // }

  async create(payload: CreateCategoryDto, userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User id ${userId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const newCategory = queryRunner.manager.create(Category, payload);

    // newCategory.user = user;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Category, newCategory);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return newCategory;
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const editedCategory = queryRunner.manager.merge(
        Category,
        category,
        changes,
      );
      await queryRunner.manager.save(Category, editedCategory);
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
      await queryRunner.manager.delete(Category, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return {
      messaje: `Category ${id} deleted`,
    };
  }
}
