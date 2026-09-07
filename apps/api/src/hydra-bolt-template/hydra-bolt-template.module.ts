import { Module } from '@nestjs/common';
import { HydraBoltTemplateService } from './hydra-bolt-template.service';
import { HydraBoltTemplateResolver } from './hydra-bolt-template.resolver';

@Module({
  providers: [HydraBoltTemplateService, HydraBoltTemplateResolver],
})
export class HydraBoltTemplateModule {}
