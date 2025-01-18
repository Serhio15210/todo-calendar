import { useMemo, useState } from "react";
import { useTodoStore } from "@/zustand/store.ts";
import { MonthExpandData } from "@/api/types.ts";
import { DropResult } from "react-beautiful-dnd";
import {
  useHolidayQuery,
  useLongWeekendQuery,
} from "@/api/weekends/queries.ts";

export const useCalendar = (currentDate: Date) => {
  const [addingDay, setAddingDay] = useState("");
  const getMonthData = useTodoStore((state) => state.getMonthData);
  const monthData = useTodoStore((state) => state.monthData);
  const todos = useTodoStore((state) => state.todos);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const updateMonthData = useTodoStore((state) => state.updateMonthData);
  const updateMonthRangeData = useTodoStore(
    (state) => state.updateMonthRangeData,
  );
  const countryCode = useTodoStore((state) => state.countryCode);
  const weekendData = useLongWeekendQuery(
    currentDate.getFullYear().toString(),
    countryCode.value,
  );
  const holidayData = useHolidayQuery(
    currentDate.getFullYear().toString(),
    countryCode.value,
  );
  const getFilteredData = (data: MonthExpandData) =>
    Object.fromEntries(
      Object.entries(data).map((item) => {
        return [
          item[0],
          item[1].filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ];
      }),
    );

  const calendarData = useMemo(() => {
    const mdata = getMonthData(currentDate);
    const filteredData = getFilteredData(mdata);

    return { month: mdata, filteredData };
  }, [getMonthData, monthData, todos, currentDate, searchQuery]);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { month: data, filteredData } = calendarData;
    const { source, destination } = result;
    console.log(source);

    if (source.droppableId === destination.droppableId) {
      const day = source.droppableId;

      const index = data[day].indexOf(filteredData[day][source.index]);
      const taskList = data[day] ? [...data[day]] : [];

      const [movedTask] = taskList.splice(index, 1);
      taskList.splice(destination.index, 0, movedTask);

      updateMonthData(
        taskList.map((item) => item.id),
        day,
      );
    } else {
      const day = source.droppableId;
      const newDay = destination.droppableId;

      const newTasks = { ...data };
      const taskList = [...newTasks[day]];
      const newTaskList = newTasks[newDay] ? [...newTasks[newDay]] : [];
      const [movedTask] = taskList.splice(source.index, 1);
      newTaskList.splice(destination.index, 0, movedTask);
      const arraySource = taskList.map((item) => item.id);
      const arrayDest = newTaskList.map((item) => item.id);
      updateMonthRangeData(arraySource, day, arrayDest, newDay);
    }
  };

  return {
    calendarData,
    onDragEnd,
    setAddingDay,
    addingDay,
    getFilteredData,
    weekendData,
    holidayData,
  };
};
