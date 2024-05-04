import * as dotenv from 'dotenv';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { winstonColorConsole } from '../common/constant/logger.constant';
import { WinstonLoggerConfigType } from '../common/type/logger-winston.type';
import { WinstonPrintfFormat } from '../common/util/winston-print.utils';

const env = dotenv.config().parsed;

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
          format: 'YYYY/MM/DD, HH:mm:ss.SSS',
        }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const level: string = info.level.toUpperCase();
          const tag = (info.tag || 'APP').toUpperCase();
          return WinstonPrintfFormat({ tag, timestamp: info.timestamp, level, name: info.name, message: info.message });
        }),
      ),
    },
    console: {
      level: config.level,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
          format: 'YYYY/MM/DD, HH:mm:ss.SSS',
        }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const level: string = info.level.toUpperCase();
          const tag = (info.tag || 'APP').toUpperCase();
          return WinstonPrintfFormat({
            tag: winstonColorConsole(tag).green,
            timestamp: winstonColorConsole(info.timestamp).red,
            level: winstonColorConsole(level).blue,
            name: winstonColorConsole(info.name).yellow,
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
