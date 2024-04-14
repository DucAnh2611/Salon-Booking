import * as winston from 'winston';
import { WinstonLoggerFileEnum } from '../../../common/enum/logger-winston.enum';
import { WinstonLoggerConfigType } from '../../../common/type/logger-winston.type';
import {
  winstonLoggerConfig,
  winstonLoggerFileConfig,
  winstonLoggerOption,
} from '../../../config/logger-winston.config';

export const createAppLogger = (config: WinstonLoggerConfigType) => {
  return winston.createLogger(winstonLoggerOption(config));
};

export const WinstonLoggerFile =
  (type: WinstonLoggerFileEnum) =>
  (data: any, { tag, name }: { tag: string; name: string }) => {
    const config = {
      maxFile: winstonLoggerFileConfig.maxFiles,
      maxSize: winstonLoggerFileConfig.maxSize,
    };

    switch (type) {
      case WinstonLoggerFileEnum.DEBUG:
        return createAppLogger({
          ...config,
          ...winstonLoggerConfig.loggerDebug,
        }).debug(JSON.stringify(data), {
          tag,
          name,
        });
      case WinstonLoggerFileEnum.ERROR:
        return createAppLogger({
          ...config,
          ...winstonLoggerConfig.loggerError,
        }).error(JSON.stringify(data), {
          tag,
          name,
        });
      case WinstonLoggerFileEnum.INFO:
        return createAppLogger({
          ...config,
          ...winstonLoggerConfig.loggerInfo,
        }).info(JSON.stringify(data), {
          tag,
          name,
        });
      case WinstonLoggerFileEnum.WARN:
        return createAppLogger({
          ...config,
          ...winstonLoggerConfig.loggerWarn,
        }).warn(JSON.stringify(data), {
          tag,
          name,
        });
      default:
        return createAppLogger({
          ...config,
          ...winstonLoggerConfig.loggerDebug,
        }).debug(JSON.stringify(data), {
          tag,
          name,
        });
    }
  };
