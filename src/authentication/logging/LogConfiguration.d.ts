import ExternalLoggerWrapper from './ExternalLoggerWrapper';

export interface LogConfigurationOptions {
  enableLog?: boolean;
  logDirectory?: string;
  logFileName?: string;
  logFileMaxSize?: string;
  loggingLevel?: string;
  maxLogFiles?: string;
  enableMasking?: boolean;
  hasExternalLogger?: boolean;
  externalLogger?: ExternalLoggerWrapper;
}

export = class LogConfiguration {
  enableLog: boolean;
  logDirectory: string;
  logFileName: string;
  logFileMaxSize: string;
  loggingLevel: string;
  maxLogFiles: string;
  enableMasking: boolean;
  hasExternalLogger: boolean;
  externalLogger?: ExternalLoggerWrapper;

  constructor(logConfig?: LogConfigurationOptions);

  isLogEnabled(): LogConfiguration['enableLog'];

  setLogEnable(enableLogValue: LogConfiguration['enableLog']): void;

  isMaskingEnabled(): LogConfiguration['isMaskingEnabled'];

  setMaskingEnabled(
    enableMaskingValue: LogConfiguration['isMaskingEnabled'],
  ): void;

  setHasExternalLogger(
    hasExternalLogger: LogConfiguration['hasExternalLogger'],
  ): void;

  isExternalLoggerSet(): LogConfiguration['hasExternalLogger'];

  setExternalLogger(externalLogger: LogConfiguration['externalLogger']): void;

  getExternalLogger(): LogConfiguration['externalLogger'];

  getLogDirectory(): LogConfiguration['logDirectory'];

  setLogDirectory(logDirectoryValue: LogConfiguration['logDirectory']): void;

  getLogFileName(): LogConfiguration['logFileName'];

  setLogFileName(logFileNameValue: LogConfiguration['logFileName']): void;

  getLogFileMaxSize(): LogConfiguration['logFileMaxSize'];

  setLogFileMaxSize(
    logFileMaxSizeValue: LogConfiguration['logFileMaxSize'],
  ): void;

  getLoggingLevel(): LogConfiguration['loggingLevel'];

  setLoggingLevel(loggingLevelValue: LogConfiguration['loggingLevel']): void;

  getMaxLogFiles(): LogConfiguration['maxLogFiles'];

  setMaxLogFiles(maxLogFilesValue: LogConfiguration['maxLogFiles']): void;

  getDefaultLoggingProperties(warningMessage: string): void;
};
