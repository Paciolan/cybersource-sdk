import type { Logger } from 'winston';

export = class ExternalLoggerWrapper {
  private extLogger: Pick<
    Logger,
    'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'
  >;

  constructor(extLogger: ExternalLoggerWrapper['extLogger']);

  getLogger(): ExternalLoggerWrapper['extLogger'];

  isLoggerEmpty(): boolean;
};
