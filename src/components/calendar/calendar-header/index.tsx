import { useTodoStore } from "@/zustand/store.ts";
import _ from "lodash";
import { ChangeEvent, useCallback, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SelectRegion from "@/components/calendar/calendar-header/select-region";
import Loader from "@/components/loader";

dayjs.extend(utc);
dayjs.extend(timezone);
type ViewMode = "month" | "week";
interface CalendarHeaderProps {
  currentDate: Date;
  changeDate: (offset: number) => void;
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setCurrentDate: (val: Date) => void;
}

const CalendarHeader = ({
  currentDate,
  changeDate,
  viewMode,
  toggleViewMode,
  setCurrentDate,
}: CalendarHeaderProps) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${dayjs(startOfWeek).format("YYYY-MM-DD")} — ${dayjs(endOfWeek).format("YYYY-MM-DD")}`;
  };

  const displayDate =
    viewMode === "month"
      ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      : weekRange(currentDate);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);
  const [query, setQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    setLoading(true);
    handleSearch(searchTerm);
  };
  const handleSearch = useCallback(
    _.debounce((searchTerm: string) => {
      setSearchQuery(searchTerm);
      setLoading(false);
    }, 400),
    [handleChange],
  );
  const ifNotCurrent = () => {
    if (viewMode === "month") {
      return (
        displayDate !==
        new Date().toLocaleString("en", { month: "long", year: "numeric" })
      );
    } else {
      const today = dayjs();
      const [startOfWeek, endOfWeek] = displayDate
        .split("—")
        .map((item) => dayjs(item.trim()));
      return !today.isBetween(startOfWeek, endOfWeek, "day", "[]");
    }
  };

  return (
    <div className="calendar-header">
      <div className="switchMonth">
        <button onClick={() => changeDate(-1)}>◀</button>
        <span>
          {displayDate}{" "}
          {ifNotCurrent() && (
            <a onClick={() => setCurrentDate(new Date())}>(To current date)</a>
          )}
        </span>
        <button onClick={() => changeDate(1)}>▶</button>
      </div>

      <input
        className={"searchInput"}
        placeholder={"Search Todo..."}
        value={query}
        onChange={handleChange}
      />
      <div className={"headerBtns"}>
        <button onClick={toggleViewMode}>
          {viewMode === "month" ? "Week View" : "Month View"}
        </button>
        <SelectRegion />
      </div>

      {loading && <Loader isSearch />}
    </div>
  );
};

export default CalendarHeader;
