import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

@Controller('users')
export class UsersController {
  @UseGuards(JwtGuard)
  @Get()
  getMe(@ActiveUser() user: ActiveUserData) {
    return user;
  }
}
