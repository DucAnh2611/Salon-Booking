import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { LOGGER_CONSTANT_LEVEL } from '../../common/constant/logger.constant';
import { WinstonLoggerFileEnum } from '../../common/enum/logger-winston.enum';
import { WinstonLoggerFile } from './winston/logger-type.winston';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Optional() private readonly name: string,
    @Optional() private readonly tag: string,
  ) {}

  log(data: any) {
    WinstonLoggerFile()(data, {
      level: LOGGER_CONSTANT_LEVEL.log,
      name: this.name || '',
      tag: this.tag || '',
    });
  }

  error(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.ERROR)(data, {
      level: LOGGER_CONSTANT_LEVEL.error,
      name: this.name || '',
      tag: this.tag || '',
    });
  }

  warn(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.WARN)(data, {
      level: LOGGER_CONSTANT_LEVEL.warn,
      name: this.name || '',
      tag: this.tag || '',
    });
  }

  debug(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.DEBUG)(data, {
      level: LOGGER_CONSTANT_LEVEL.debug,
      name: this.name || '',
      tag: this.tag || '',
    });
  }

  info(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.INFO)(data, {
      level: LOGGER_CONSTANT_LEVEL.info,
      name: this.name || '',
      tag: this.tag || '',
    });
  }
}
