import { Controller, Get, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { User } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get()
  getMe(@User() user: UserModel, @User('email') email: string) {
    console.log({
      user: user,
      email: email,
    });
    return user;
  }
}
