import { useState } from "react";
import "./styles/App.scss";
import CalendarHeader from "@/components/calendar/calendar-header";
import CalendarGrid from "@/components/calendar/calendar-grid";

type ViewMode = "month" | "week";
function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const changeDate = (offset: number) => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      } else {
        return new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate() + offset * 7,
        );
      }
    });
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "month" ? "week" : "month"));
  };

  return (
    <div className="calendar">
      <CalendarHeader
        currentDate={currentDate}
        changeDate={changeDate}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        setCurrentDate={setCurrentDate}
      />
      <CalendarGrid currentDate={currentDate} viewMode={viewMode} />
    </div>
  );
}

export default App;
