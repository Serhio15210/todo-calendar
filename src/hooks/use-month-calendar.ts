import dayjs from "dayjs";
import { useCalendar } from "@/hooks/use-calendar.ts";

export const useMonthCalendar = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = dayjs(new Date(year, month, 1));
  const endOfMonth = dayjs(new Date(year, month + 1, 0));
  const firstDayOfWeek = startOfMonth.isoWeekday();
  const lastDayOfWeek = endOfMonth.isoWeekday();
  const { weekendData, holidayData } = useCalendar(currentDate);
  const isWeekend = (date: string) => {
    if (weekendData.data) {
      for (let i = 0; i < weekendData.data.length; i++) {
        if (
          dayjs(date).isBetween(
            dayjs(weekendData.data[i].startDate),
            dayjs(weekendData.data[i].endDate),
            null,
            "[]",
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const isHoliday = (date: string) => {
    if (holidayData.data) {
      for (let i = 0; i < holidayData.data.length; i++) {
        if (date === holidayData.data[i].date) {
          return `${holidayData.data[i].name} ${holidayData.data[i].localName ? `(${holidayData.data[i].localName})` : ""}`;
        }
      }
    }
    return "";
  };
  const prevMonthDays = Array.from({ length: firstDayOfWeek - 1 }, (_, i) => ({
    date: startOfMonth
      .subtract(firstDayOfWeek - 1 - i, "day")
      .format("YYYY-MM-DD"),
    weekend: false,
    holiday: false,
  }));

  const currentMonthDays = Array.from({ length: endOfMonth.date() }, (_, i) => {
    const date = startOfMonth.add(i, "day").format("YYYY-MM-DD");
    return { date, weekend: isWeekend(date), holiday: isHoliday(date) };
  });

  const nextMonthDays = Array.from({ length: 7 - lastDayOfWeek }, (_, i) => ({
    date: endOfMonth.add(i + 1, "day").format("YYYY-MM-DD"),
    weekend: false,
    holiday: false,
  }));
  const days = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  return { days };
};
