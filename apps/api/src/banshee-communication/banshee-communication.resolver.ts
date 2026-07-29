import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BansheeCommunicationService } from './banshee-communication.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SharePlotListInput } from './dto/share-plot-list.input';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { ContactUsInput } from './dto/contact-us.input';
import type { FileUpload } from 'graphql-upload-ts';
import * as GraphQLTypes from 'src/graphql-types';

@Resolver('BansheeCommunication')
@UseGuards(JwtGuard, RolesGuard)
export class BansheeCommunicationResolver {
  constructor(
    private readonly bansheeCommunicationService: BansheeCommunicationService,
  ) {}

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('bansheeSharePlotList')
  async bansheeSharePlotList(
    @Args('input') input: SharePlotListInput,
    // Typed as the FileUpload interface (not Promise<Upload>) so the global
    // ValidationPipe skips it — a Promise/class metatype makes class-transformer
    // throw "Promise resolver undefined is not a function".
    @Args('image') image: FileUpload,
    @Args('csv') csv: FileUpload,
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeSharePlotListResponse> {
    return this.bansheeCommunicationService.sharePlotList(
      input.companyId,
      input.recipientEmail,
      image,
      csv,
      user,
    );
  }

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('bansheeContactUs')
  async bansheeContactUs(
    @Args('input') input: ContactUsInput,
    // `attachments` is an optional `[Upload!]` list, so it may be undefined.
    @Args('attachments') attachments: FileUpload[] | undefined,
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeContactUsResponse> {
    return this.bansheeCommunicationService.contactUs(
      input.companyId,
      input.message,
      attachments,
      user,
    );
  }
}
