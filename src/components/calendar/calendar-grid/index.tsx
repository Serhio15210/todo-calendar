import MonthCalendar from "@/components/calendar/calendar-lists/month-calendar";
import WeekCalendar from "@/components/calendar/calendar-lists/week-calendar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCalendar } from "@/hooks/use-calendar.ts";
import { useTodoStore } from "@/zustand/store.ts";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

dayjs.extend(customParseFormat);
type ViewMode = "month" | "week";

interface CalendarGridProps {
  currentDate: Date;
  viewMode: ViewMode;
}

const CalendarGrid = ({ currentDate, viewMode }: CalendarGridProps) => {
  const { calendarData, weekendData, holidayData } = useCalendar(currentDate);

  const countryCode = useTodoStore((state) => state.countryCode);
  const [code, setCode] = useState(countryCode.value);

  useEffect(() => {
    if (currentDate && countryCode.value) {
      if (weekendData.data?.length) {
        if (
          weekendData.data[0].startDate.split("-")[0] !==
            currentDate.getFullYear().toString() ||
          countryCode.value !== code
        ) {
          setCode(countryCode.value);
          weekendData.refetch();
          holidayData.refetch();
        }
      }
    }
  }, [currentDate, countryCode]);
  return (
    <div style={{ paddingTop: 100 }}>
      {(weekendData.isLoading ||
        holidayData.isLoading ||
        weekendData.isFetching ||
        holidayData.isFetching) && <Loader />}
      {viewMode === "month" ? (
        <MonthCalendar
          currentDate={currentDate}
          data={calendarData.month}
          filterData={calendarData.filteredData}
        />
      ) : (
        <WeekCalendar currentDate={currentDate} />
      )}
    </div>
  );
};
export default CalendarGrid;
