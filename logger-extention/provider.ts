import { Provider, ValueOrPromise } from '@loopback/core';
import { Logger, createLogger, transports } from 'winston';

export class LoggerProvider implements Provider<Logger> {
  logger = createLogger({
    transports: [new transports.Console()],
  });

  value(): ValueOrPromise<Logger> {
    return this.logger;
  }
}
