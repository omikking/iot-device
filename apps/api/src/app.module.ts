import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CoffeesModule } from './coffees/coffees.module';
import { CompaniesModule } from './companies/companies.module';
import { DateScalar } from './common/scalars/date.scalar';
import { UsersModule } from './users/users.module';
import { UserPermissionsModule } from './userPermissions/userPermissions.module';
import { SitesModule } from './sites/sites.module';
import { LevelsModule } from './levels/levels.module';
import { DrivesModule } from './drives/drives.module';
import { LocationsModule } from './locations/locations.module';
import { BoltResultsModule } from './boltResults/boltResults.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    CoffeesModule,
    UsersModule,
    UserPermissionsModule,
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
