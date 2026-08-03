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
import { HazardsModule } from './hazards/hazards.module';
import { EnumModule } from './enums/enum.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { LogGraphQLPlugin } from './common/plugins/log-graphql.plugin';
import { EmailModule } from './email/email.module';
import { InvitationModule } from './invitation/invitation.module';

import { BansheeRequestModule } from './banshee-request/banshee-request.module';
import { ProceqModule } from './proceq/proceq.module';
import { BansheeStatsModule } from './banshee-stats/banshee-stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BansheeTemplateModule } from './banshee-template/banshee-template.module';
import { BansheeCartModule } from './banshee-cart/banshee-cart.module';
import { BansheeOrderModule } from './banshee-order/banshee-order.module';
import { BansheeCommmunicationModule } from './banshee-communication/banshee-communication.module';
import { OpticboltModule } from './opticbolt/opticbolt.module';
import { HydraBoltModule } from './hydra-bolt/hydra-bolt.module';
import { HydraBoltsModule } from './hydra-bolts/hydra-bolts.module';

const enableGraphQLLog = process.env.LOG_GRAPHQL === '1';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      plugins: enableGraphQLLog ? [LogGraphQLPlugin] : [],
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
    HazardsModule,
    EnumModule,
    ResetPasswordModule,
    EmailModule,
    InvitationModule,
    BansheeRequestModule,
    ProceqModule,
    BansheeStatsModule,
    BansheeTemplateModule,
    BansheeCartModule,
    BansheeOrderModule,
    BansheeCommmunicationModule,
    OpticboltModule,
    HydraBoltModule,
    HydraBoltsModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
