import { TimeSymbol } from '../type/time.type';

export const TIME_UNIT: { [key: string]: TimeSymbol } = {
  day: {
    symbol: 'd',
    children: {
      long: 24,
      symbol: 'h',
    },
  },
  hour: {
    symbol: 'h',
    children: {
      long: 60,
      symbol: 'm',
    },
  },
  minute: {
    symbol: 'm',
    children: {
      long: 60,
      symbol: 's',
    },
  },
  second: {
    symbol: 's',
    children: {
      long: 1000,
      symbol: 'ms',
    },
  },
};

export const TIME_UNIT_PARTTERN = /[d,s,h,m]{1}/gm;
export const TIME_LONG_PARTTERN = /[0-9]{1,}/gm;
export const TIME_PARTTERN = new RegExp(TIME_UNIT_PARTTERN.source + '|' + TIME_LONG_PARTTERN.source);
