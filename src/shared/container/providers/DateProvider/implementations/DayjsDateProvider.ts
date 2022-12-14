import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);
export class DayjsDateProvider implements IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);

    return dayjs(end_date_utc).diff(start_date_utc, "days");
  }

  addDays(days: number, date?: Date): Date {
    const new_date = date ? dayjs(date) : dayjs();
    return dayjs(new_date).add(days, "days").toDate();
  }

  addHours(hours: number, date?: Date): Date {
    const new_date = date ? dayjs(date) : dayjs();
    return new_date.add(hours, "hours").toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  subtractHours(hours: number, date?: Date): Date {
    const new_date = date ? dayjs(date) : dayjs();
    return dayjs(new_date).subtract(hours, "hours").toDate();
  }
}
