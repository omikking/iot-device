import { Logger } from '@nestjs/common';

/**
 * The Banshee services log via the Nest `Logger` on their error / negative
 * paths (and on routine stats/order operations). Those logs are *expected* when
 * the unit tests exercise those branches — they only add noise to the test
 * output, so we silence the logger for the whole unit-test run.
 */
Logger.overrideLogger(false);
