import { useState } from "react";
import TaskCard from "@/components/todo/task-card";
import NewTaskCard from "@/components/todo/new-task-card";
import DroppableCard from "@/components/Droppable/index.tsx";
import { MonthExpandData, Task } from "@/api/types.ts";
import { useTodoStore } from "@/zustand/store.ts";
import dayjs from "dayjs";

type Day = {
  date: string;
  weekend: boolean;
  holiday: string | boolean;
};

interface DroppableCellProps {
  data: MonthExpandData;
  day: Day;
  isWeek?: boolean;
  currentDate: Date;
}

const DroppableCell = ({
  data,
  day,
  currentDate,
  isWeek,
}: DroppableCellProps) => {
  const [addingDay, setAddingDay] = useState("");
  const editTodo = useTodoStore((state) => state.editTodo);
  const addToDodos = useTodoStore((state) => state.addToTodos);
  const removeTodo = useTodoStore((state) => state.removeFromTodos);
  const isDisabled = (day: string) => {
    return dayjs(day).get("month") !== currentDate.getMonth();
  };
  const onEdit = (item: Task) => {
    editTodo(item);
  };

  const addNewTodo = (todo: Task) => {
    addToDodos(todo, addingDay);
    setAddingDay("");
  };
  const deleteTodo = (id: string, date: string) => {
    removeTodo(id, date);
    setAddingDay("");
  };
  return (
    <DroppableCard
      droppableId={day.date}
      direction={isWeek ? "horizontal" : "vertical"}
    >
      {(provided, snapshot) => (
        <div
          key={day.date}
          className={`day-cell ${isWeek ? "weekCell" : ""} ${data[day.date]?.length > 3 ? "overflow" : ""} ${day.weekend ? "weekend" : day.holiday ? "holiday" : ""} ${snapshot.isDraggingOver ? "drag" : ""} ${isDisabled(day.date) ? "disabled" : ""}`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="headerRow">
            <span>
              {isWeek ? new Date(day.date).toDateString().split(" ")[0] : ""}{" "}
              {day.date.split("-").at(-1)} {day.holiday || ""}
            </span>
            <button className={"addBtn"} onClick={() => setAddingDay(day.date)}>
              <img src={"/add.svg"} alt={"add"} />
            </button>
          </div>

          <div className={"taskRow"}>
            {data[day.date]?.map((task, taskIndex) => (
              <TaskCard
                key={task.id}
                card={task}
                index={taskIndex}
                onEdit={onEdit}
                onDelete={() => deleteTodo(task.id, day.date)}
              />
            ))}
          </div>

          {addingDay && addingDay === day.date && (
            <NewTaskCard addTodo={addNewTodo} setAddingDay={setAddingDay} />
          )}
          {provided.placeholder}
        </div>
      )}
    </DroppableCard>
  );
};

export default DroppableCell;
