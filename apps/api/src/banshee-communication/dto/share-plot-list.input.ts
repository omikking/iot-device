import { IsString, IsUUID } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class SharePlotListInput extends GraphQLTypes.BansheeSharePlotListInput {
  @IsUUID()
  companyId!: string;

  @IsString()
  recipientEmail!: string;
}
