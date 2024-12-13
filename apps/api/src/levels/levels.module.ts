import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsResolver } from './levels.resolver';
import { LevelDrivesResolver } from './level-drives.resolver';
import { LevelBoltResultsResolver } from './level-boltResults.resolver';

@Module({
  providers: [
    LevelsService,
    LevelsResolver,
    LevelDrivesResolver,
    LevelBoltResultsResolver,
  ],
})
export class LevelsModule {}
