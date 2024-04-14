import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { WinstonLoggerFileEnum } from '../../common/enum/logger-winston.enum';
import { WinstonLoggerFile } from './winston/logger-type.winston';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(@Optional() private readonly name: string) {}

  log() {}

  error(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.ERROR)(data, {
      tag: 'error',
      name: this.name || '',
    });
  }

  warn(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.WARN)(data, {
      tag: 'warn',
      name: this.name || '',
    });
  }

  debug(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.DEBUG)(data, {
      tag: 'debug',
      name: this.name || '',
    });
  }

  info(data: any) {
    WinstonLoggerFile(WinstonLoggerFileEnum.INFO)(data, {
      tag: 'info',
      name: this.name || '',
    });
  }
}
