import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
// import { Customer } from '../entities/customer.entity';
// import { ProductsService } from './../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    // @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    // private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const users = await this.userRepo.find();
    users.sort((a, b) => {
      return a.id - b.id;
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.userRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async create(payload: CreateUserDto) {
    const existingUser = await this.userRepo.findOneBy({
      email: payload.email,
    });
    if (existingUser) {
      throw new NotAcceptableException(
        `Email '${existingUser.email}' is alredy in use with id ${existingUser.id}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const newUser = queryRunner.manager.create(User, payload);

    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(User, newUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return newUser;
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const editedUser = queryRunner.manager.merge(User, user, changes);
      await queryRunner.manager.save(User, editedUser);
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
      await queryRunner.manager.delete(User, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }

    return {
      messaje: `User ${id} deleted`,
    };
  }
}
