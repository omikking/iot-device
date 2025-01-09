import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CoffeesModule } from './coffees/coffees.module';
import { CompaniesModule } from './companies/companies.module';
import { DateScalar } from './common/scalars/date.scalar';
import { SitesModule } from './sites/sites.module';
import { LevelsModule } from './levels/levels.module';
import { DrivesModule } from './drives/drives.module';
import { LocationsModule } from './locations/locations.module';
import { BoltResultsModule } from './boltResults/boltResults.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    CoffeesModule,
    CompaniesModule,
    SitesModule,
    LevelsModule,
    DrivesModule,
    LocationsModule,
    BoltResultsModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
