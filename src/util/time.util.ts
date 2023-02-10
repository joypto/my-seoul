import { TrendingDuration, ONE_DAY, ONE_WEEK, ONE_YEAR } from 'src/constants/consts';

export class TimeUtil {
    static nowToSeconds(): number {
        return Math.floor(Date.now() / 1000);
    }

    static trendingDurationToSeconds(time: TrendingDuration): number {
        switch (time) {
            case TrendingDuration.DAY:
                return ONE_DAY;
            case TrendingDuration.WEEK:
                return ONE_WEEK;
            case TrendingDuration.MONTH:
                return 30 * ONE_DAY;
            case TrendingDuration.THREE_MONTH:
                return 3 * 30 * ONE_DAY;
            case TrendingDuration.YEAR:
                return ONE_YEAR;
            default:
                return 30 * ONE_DAY;
        }
    }
}
