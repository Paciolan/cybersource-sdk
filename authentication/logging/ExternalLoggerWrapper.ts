import type { Logger } from 'winston';

export class ExternalLoggerWrapper {
  constructor(
    private extLogger: Pick<
      Logger,
      'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'
    >,
  ) {}

  getLogger() {
    return this.extLogger;
  }

  isLoggerEmpty() {
    return typeof this.extLogger === 'undefined';
  }
}
