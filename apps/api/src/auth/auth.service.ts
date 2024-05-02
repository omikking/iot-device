import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  test() {
    return 'Auth Service says hello.';
  }
}
