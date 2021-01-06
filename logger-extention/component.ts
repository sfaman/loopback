import { Component, ProviderMap } from '@loopback/core';
import { LoggerProvider } from './provider';
export { Logger } from 'winston';

export class LoggerComponent implements Component {
  providers: ProviderMap = {
    logger: LoggerProvider,
  };
}
