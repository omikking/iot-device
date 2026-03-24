import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProceqAuthService } from './proceq-auth.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ProceqLoginUrlResponse } from './dto/proceq-login-url-response.type';

@Resolver()
export class ProceqAuthResolver {
  constructor(private readonly authService: ProceqAuthService) {}

  @UseGuards(JwtGuard)
  @Query('proceqLoginUrl')
  proceqLoginUrl(
    @ActiveUser('email') email: string,
    @Args('callbackUrl') callbackUrl: string,
  ): ProceqLoginUrlResponse {
    console.log('EMAIL1', email);
    console.log('CALLBACK URL1', callbackUrl);
    const url = this.authService.getAuthorizationUrl(email, callbackUrl);
    return { url };
  }
}
