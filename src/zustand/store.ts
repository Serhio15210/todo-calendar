import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { CountryCode, MonthData, Task } from "@/api/types.ts";
dayjs.extend(isBetween);

interface IStoreState {
  searchQuery: string;
  countryCode: CountryCode;
  setSearchQuery: (val: string) => void;
  setCountryCode: (val: CountryCode) => void;
  todos: Task[];
  monthData: MonthData;
  addToTodos: (item: Task, date: string) => void;
  editTodo: (item: Task) => void;
  getMonthData: (date: Date) => Record<string, Task[]>;
  getWeekData: (
    date: Date,
    weekStart: string,
    weekEnd: string,
  ) => Record<string, Task[]>;
  updateMonthData: (array: string[], date: string) => void;
  updateMonthRangeData: (
    arraySource: string[],
    dateSource: string,
    arrayDest: string[],
    dateDest: string,
  ) => void;
  addToMonthData: (id: Task["id"], date: string) => void;
  removeFromMonthData: (id: Task["id"], date: string) => void;
  removeFromTodos: (id: string, date: string) => void;
}

export const useTodoStore = create<IStoreState>()(
  persist(
    (set, get) => ({
      searchQuery: "",
      countryCode: { value: "", label: "" },
      todos: [],
      monthData: {},
      setSearchQuery: (val) =>
        set(() => {
          return { searchQuery: val };
        }),
      setCountryCode: (val) =>
        set(() => {
          return { countryCode: val };
        }),
      addToTodos: (item, date) =>
        set((state) => {
          const newData = [item].concat(state.todos);

          state.addToMonthData(item.id, date);
          return { todos: newData };
        }),
      editTodo: (item) =>
        set((state) => {
          const taskList = [...state.todos];
          const updateIndex = taskList.findIndex((task) => task.id === item.id);
          if (updateIndex !== -1) {
            taskList[updateIndex] = item;
          }
          return { todos: taskList };
        }),
      addToMonthData: (id, date) =>
        set((state) => {
          const monthDate = date.slice(0, -3);
          const month = { ...state.monthData[monthDate] };
          const newArray = [id].concat(month[date] || []);
          const newData = {
            ...state.monthData,
            [monthDate]: { ...month, [date]: newArray },
          };
          return { monthData: newData };
        }),
      updateMonthData: (array, date) =>
        set((state) => {
          const monthDate = date.slice(0, -3);
          const month = { ...state.monthData[monthDate] };
          const newData = {
            ...state.monthData,
            [monthDate]: { ...month, [date]: array },
          };
          return { monthData: newData };
        }),
      updateMonthRangeData: (arraySource, dateSource, arrayDest, dateDest) =>
        set((state) => {
          const monthDate = dateDest.slice(0, -3);
          const month = { ...state.monthData[monthDate] };
          const newData = {
            ...state.monthData,
            [monthDate]: {
              ...month,
              [dateSource]: arraySource,
              [dateDest]: arrayDest,
            },
          };
          return { monthData: newData };
        }),
      removeFromTodos: (id, date) =>
        set((state) => {
          const newData = state.todos.filter((item) => item.id !== id);
          state.removeFromMonthData(id, date);
          return { todos: newData };
        }),
      removeFromMonthData: (id, date) =>
        set((state) => {
          const monthDate = date.slice(0, -3);
          const month = { ...state.monthData[monthDate] };
          const newArray = (month[date] || []).filter((item) => item !== id);
          const newData = {
            ...state.monthData,
            [monthDate]: { ...month, [date]: newArray },
          };
          return { monthData: newData };
        }),
      getMonthData: (monthDate) => {
        const monthData =
          get().monthData[dayjs(monthDate).format("YYYY-MM")] || {}; // Данные по месяцу или пустой объект

        const transformedData = Object.entries(monthData).reduce(
          (acc, [date, taskIds]) => {
            acc[date] = (taskIds || [])
              .map((taskId) => get().todos.find((task) => task.id === taskId))
              .filter(Boolean) as Task[];
            return acc;
          },
          {} as Record<string, Task[]>,
        );

        return transformedData;
      },
      getWeekData: (monthDate, weekStart, weekEnd) => {
        const mainDate = dayjs(monthDate).format("YYYY-MM");
        const startDate = dayjs(weekStart).format("YYYY-MM-DD");
        const endDate = dayjs(weekEnd).format("YYYY-MM-DD");
        const monthData = get().monthData[mainDate] || {};
        const transformedData = Object.entries(monthData)
          .filter((a) => {
            const date = dayjs(a[0]);
            return date.isBetween(dayjs(startDate), dayjs(endDate), null, "[]");
          })
          .reduce(
            (acc, [date, taskIds]) => {
              acc[date] = (taskIds || [])
                .map((taskId) => get().todos.find((task) => task.id === taskId))
                .filter(Boolean) as Task[];
              return acc;
            },
            {} as Record<string, Task[]>,
          );

        return transformedData;
      },
    }),

    {
      name: "todo-storage",
      partialize: (state: IStoreState) => ({
        countryCode: state.countryCode,
        todos: state.todos,
        monthData: state.monthData,
      }),
    },
  ),
);
