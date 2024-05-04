import { TIME_LONG_PARTTERN, TIME_PARTTERN, TIME_UNIT, TIME_UNIT_PARTTERN } from '../constant/time.constant';

const switchTime = ([time, unit]: [time: number, unit: string]): number => {
  switch (unit) {
    case TIME_UNIT.day.symbol:
      return time * switchTime([TIME_UNIT.day.children.long, TIME_UNIT.day.children.symbol]);

    case TIME_UNIT.day.symbol:
      return time * switchTime([TIME_UNIT.day.children.long, TIME_UNIT.day.children.symbol]);

    case TIME_UNIT.day.symbol:
      return time * switchTime([TIME_UNIT.day.children.long, TIME_UNIT.day.children.symbol]);

    case TIME_UNIT.day.symbol:
      return time * switchTime([TIME_UNIT.day.children.long, TIME_UNIT.day.children.symbol]);
    default:
      return time;
  }
};

export function CalculateTime({ time }: { time: string }) {
  const matches = time.match(TIME_PARTTERN);

  if (!matches) {
    return null;
  }

  const number = time[0].match(TIME_LONG_PARTTERN)[0]; // Extract the number part
  const unit = time[0].match(TIME_UNIT_PARTTERN)[0]; // Extract the unit part

  return switchTime([parseInt(number), unit]);
}
