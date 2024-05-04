export type TimeType = 'd' | 'h' | 'm' | 's' | 'ms';

export type TimeChildrenSymbol = {
  long: number;
  symbol: TimeType;
};

export type TimeSymbol = {
  symbol: TimeType;
  children: TimeChildrenSymbol;
};
