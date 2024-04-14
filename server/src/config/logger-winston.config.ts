import * as dotenv from 'dotenv';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { WinstonLoggerConfigType } from '../common/type/logger-winston.type';
import { WinstonPrintfForma } from '../common/util/winston-print.utils';

const env = dotenv.config().parsed;

const wistonColorConsole = (...args) => ({
  black: `\x1b[30m${args.join(' ')}\x1b[37m`,
  red: `\x1b[31m${args.join(' ')}\x1b[37m`,
  green: `\x1b[32m${args.join(' ')}\x1b[37m`,
  yellow: `\x1b[33m${args.join(' ')}\x1b[37m`,
  blue: `\x1b[34m${args.join(' ')}\x1b[37m`,
  magenta: `\x1b[35m${args.join(' ')}\x1b[37m`,
  cyan: `\x1b[36m${args.join(' ')}\x1b[37m`,
  white: `\x1b[37m${args.join(' ')}\x1b[37m`,
});

export const winstonLoggerFileConfig = {
  maxSize: env.LOGGER_WINSTON_MAXSIZE,
  maxFiles: env.LOGGER_WINSTON_MAXFILES,
  filename: {
    debug: env.LOGGER_WINSTON_FILENAME_DEBUG,
    error: env.LOGGER_WINSTON_FILENAME_ERROR,
    warn: env.LOGGER_WINSTON_FILENAME_WARN,
    info: env.LOGGER_WINSTON_FILENAME_INFO,
  },
};

export const winstonLoggerConfig = {
  loggerDebug: {
    level: 'debug',
    filename: winstonLoggerFileConfig.filename.debug,
  },
  loggerError: {
    level: 'error',
    filename: winstonLoggerFileConfig.filename.error,
  },
  loggerInfo: {
    level: 'info',
    filename: winstonLoggerFileConfig.filename.info,
  },
  loggerWarn: {
    level: 'warn',
    filename: winstonLoggerFileConfig.filename.warn,
  },
};

export const winstonLoggerTransport = (config: WinstonLoggerConfigType): Transport[] => {
  const options: { console: ConsoleTransportOptions; file: DailyRotateFileTransportOptions } = {
    file: {
      level: config.level,
      filename: config.filename,
      maxFiles: config.maxFile,
      maxSize: config.maxSize,
      json: true,
      handleExceptions: true,
      datePattern: 'YYYY-MM-DD-HH',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD, HH:mm:ss.SSS',
        }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const level: string = info.level.toUpperCase();
          const tag = (info.tags || 'APP').toUpperCase();
          return WinstonPrintfForma({ tag, timestamp: info.timestamp, level, name: info.name, message: info.message });
        }),
      ),
    },
    console: {
      level: config.level,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD, HH:mm:ss.SSS',
        }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const level: string = info.level.toUpperCase();
          const tag = (info.tags || 'APP').toUpperCase();
          return WinstonPrintfForma({
            tag: wistonColorConsole(tag).green,
            timestamp: info.timestamp,
            level: wistonColorConsole(level).blue,
            name: wistonColorConsole(info.name).yellow,
            message: info.message,
          });
        }),
      ),
    },
  };

  const transports: Transport[] = [
    new winston.transports.Console(options.console),
    new winston.transports.DailyRotateFile(options.file),
  ];

  return transports;
};

export const winstonLoggerOption = (config: WinstonLoggerConfigType): LoggerOptions => {
  return {
    level: config.level,
    transports: winstonLoggerTransport(config),
    exitOnError: false,
  };
};
