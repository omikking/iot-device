/**
 * Dedicated Jest config for the Banshee backend unit tests.
 *
 * This is intentionally separate from the default Jest config (the `"jest"`
 * key in package.json, used by `pnpm test`) so that adding these tests does
 * not change how the existing co-located `*.spec.ts` suites run.
 *
 * Run with: `pnpm --filter api test:unit`
 *
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
  displayName: 'banshee-unit',
  rootDir: '.',
  // Only discover tests inside the dedicated unit-test folder.
  roots: ['<rootDir>/unit-test'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  // The source code uses absolute `src/...` imports (tsconfig baseUrl).
  // Map them so the services-under-test resolve correctly inside Jest.
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // NestJS `@Injectable()` decorators rely on the reflect-metadata polyfill;
  // the setup file then silences the Nest Logger noise during tests.
  setupFiles: ['reflect-metadata', '<rootDir>/unit-test/jest.setup.ts'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/banshee-request/**/*.service.ts',
    'src/banshee-cart/**/*.service.ts',
    'src/banshee-order/**/*.service.ts',
    'src/banshee-template/**/*.service.ts',
    'src/banshee-stats/**/*.service.ts',
    'src/banshee-communication/banshee-communication.service.ts',
  ],
  coverageDirectory: '<rootDir>/coverage-unit',
};
