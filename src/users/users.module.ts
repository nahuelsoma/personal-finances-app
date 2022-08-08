import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { ProfileController } from './controllers/profile.controller';
import { UsersService } from './services/users.service';
import { ItemsModule } from '../items/items.module';
import { User } from './entities/user.entity';

@Module({
  imports: [ItemsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
