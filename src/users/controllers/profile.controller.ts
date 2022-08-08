import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../auth/guards/roles.guard';
// import { Roles } from '../../auth/decorators/roles.decorator';
// import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { UsersService } from '../services/users.service';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../items/services/categories.service';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private usersService: UsersService,
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
  ) {}

  // @Roles(Role.USER)
  @Get('my-items')
  getItems(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.itemsService.findItemsByUser(user.sub);
  }
}
