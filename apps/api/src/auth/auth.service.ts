import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'Time to create an account' };
  }

  signin() {
    return { msg: 'Time to login' };
  }
}
