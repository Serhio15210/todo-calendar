import { DragDropContext } from "react-beautiful-dnd";
import { useTodoStore } from "@/zustand/store.ts";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useCalendar } from "@/hooks/use-calendar.ts";
import DroppableCell from "@/components/Droppable/droppable-cell.tsx";
import { useMonthCalendar } from "@/hooks/use-month-calendar.ts";

interface WeekCalendarProps {
  currentDate: Date;
}
const WeekCalendar = ({ currentDate }: WeekCalendarProps) => {
  const startOfWeek = dayjs(currentDate).startOf("week").add(1, "day"); // Начало недели (понедельник)
  const endOfWeek = startOfWeek.add(6, "day"); // Конец недели (воскресенье)
  const { days } = useMonthCalendar(currentDate);

  const weekDays = days.filter((day) =>
    dayjs(day.date).isBetween(startOfWeek, endOfWeek, null, "[]"),
  );
  const { onDragEnd, getFilteredData } = useCalendar(currentDate);
  const getWeekData = useTodoStore((state) => state.getWeekData);

  const data = useMemo(() => {
    const weekData = getWeekData(
      currentDate,
      weekDays[0].date,
      weekDays[weekDays.length - 1].date,
    );
    const filteredData = getFilteredData(weekData);
    return { weekData, filteredData };
  }, [getWeekData, weekDays, currentDate]);

  return (
    <div className={"weekContainer"}>
      {/*<div className="weekHeader">*/}
      {/*    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (*/}
      {/*        <p key={index}>{day}</p>*/}
      {/*    ))}*/}
      {/*</div>*/}
      <div className="calendar-grid week">
        <DragDropContext onDragEnd={onDragEnd}>
          {weekDays.map((day, index) => (
            <DroppableCell
              key={`${day.date}-${index}`}
              data={data.weekData}
              day={day}
              currentDate={currentDate}
              isWeek
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default WeekCalendar;
