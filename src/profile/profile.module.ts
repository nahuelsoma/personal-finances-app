import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, ItemsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
