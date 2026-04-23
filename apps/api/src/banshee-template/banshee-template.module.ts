import { Module } from '@nestjs/common';
import { BansheeTemplateService } from './banshee-template.service';
import { BansheeTemplateResolver } from './banshee-template.resolver';

@Module({
  providers: [BansheeTemplateService, BansheeTemplateResolver],
})
export class BansheeTemplateModule {}
