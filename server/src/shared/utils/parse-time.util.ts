import { TIME_LONG_PARTTERN, TIME_PARTTERN, TIME_UNIT, TIME_UNIT_PARTTERN } from '../../common/constant/time.constant';

export class TimeUtil {
  static toMilisecond({ time }: { time: string }) {
    const matches = time.match(TIME_PARTTERN);

    if (!matches) {
      return null;
    }

    const number = time.match(TIME_LONG_PARTTERN)[0];
    const unit = time.match(TIME_UNIT_PARTTERN)[0];

    return TimeUtil.switchTime([parseInt(number), unit]);
  }

  static switchTime = ([time, unit]: [time: number, unit: string]): number => {
    switch (unit) {
      case TIME_UNIT.day.symbol:
        return time * TimeUtil.switchTime([TIME_UNIT.day.children.long, TIME_UNIT.day.children.symbol]);

      case TIME_UNIT.hour.symbol:
        return time * TimeUtil.switchTime([TIME_UNIT.hour.children.long, TIME_UNIT.hour.children.symbol]);

      case TIME_UNIT.minute.symbol:
        return time * TimeUtil.switchTime([TIME_UNIT.minute.children.long, TIME_UNIT.minute.children.symbol]);

      case TIME_UNIT.second.symbol:
        return time * TimeUtil.switchTime([TIME_UNIT.second.children.long, TIME_UNIT.second.children.symbol]);
      default:
        return time;
    }
  };
}
