import { Controller, Get, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { User } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get()
  getMe(@User() user: UserModel) {
    return user;
  }
}
