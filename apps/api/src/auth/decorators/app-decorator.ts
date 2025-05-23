import { SetMetadata } from '@nestjs/common';
import { Application } from '@prisma/client';

export const App = (...apps: Application[]) => SetMetadata('apps', apps);
