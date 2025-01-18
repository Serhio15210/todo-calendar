import { DragDropContext } from "react-beautiful-dnd";
import { MonthExpandData } from "@/api/types.ts";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { useMonthCalendar } from "@/hooks/use-month-calendar.ts";
import { useCalendar } from "@/hooks/use-calendar.ts";
import DroppableCell from "@/components/Droppable/droppable-cell.tsx";

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

interface MonthCalendarProps {
  currentDate: Date;
  data: MonthExpandData;
  filterData: MonthExpandData;
  setData?: (data: (prev: MonthExpandData) => MonthExpandData) => void;
}

const MonthCalendar = ({ currentDate }: MonthCalendarProps) => {
  const { days } = useMonthCalendar(currentDate);
  const { onDragEnd, calendarData } = useCalendar(currentDate);

  return (
    <>
      <div className="day-header">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <p key={index}>{day}</p>
        ))}
      </div>

      <div className="calendar-grid">
        <DragDropContext onDragEnd={onDragEnd}>
          {days.map((day, index) => (
            <DroppableCell
              key={`${day.date}-${index}`}
              data={calendarData.filteredData}
              day={day}
              currentDate={currentDate}
            />
          ))}
        </DragDropContext>
      </div>
    </>
  );
};

export default MonthCalendar;
