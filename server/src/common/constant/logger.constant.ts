export const TAG_LOGGER = 'tag';
export const TIMESTAMP_LOGGER = 'timestamp';
export const LEVEL_LOGGER = 'level';
export const NAME_LOGGER = 'name';
export const MESSAGE_LOGGER = 'message';

export const winstonColorConsole = (...args: string[]) => ({
    black: `\x1b[30m${args.join(' ')}\x1b[37m`,
    red: `\x1b[31m${args.join(' ')}\x1b[37m`,
    green: `\x1b[32m${args.join(' ')}\x1b[37m`,
    yellow: `\x1b[33m${args.join(' ')}\x1b[37m`,
    blue: `\x1b[34m${args.join(' ')}\x1b[37m`,
    magenta: `\x1b[35m${args.join(' ')}\x1b[37m`,
    cyan: `\x1b[36m${args.join(' ')}\x1b[37m`,
    white: `\x1b[37m${args.join(' ')}\x1b[37m`,
});

export const WinstonLoggerTemplate = {
    simple: `[${TIMESTAMP_LOGGER}] | [${TAG_LOGGER}] | [${LEVEL_LOGGER}] | [${NAME_LOGGER}] : ${MESSAGE_LOGGER}`,
};

export const LOGGER_CONSTANT_NAME = {
    request: 'Request',
    response: 'Response',
    exception: 'Exception',
    seed: 'Seed',
};

export const LOGGER_CONSTANT_LEVEL = {
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
    debug: 'DEBUG',
    log: 'LOG',
};
