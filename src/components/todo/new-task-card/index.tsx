import { useEffect, useRef, useState, useCallback } from "react";
import { Task } from "@/api/types.ts";
import styles from "../task.module.scss";
import { v4 as uuidv4 } from "uuid";

interface NewTaskCardProps {
  addTodo: (e: Task) => void;
  setAddingDay: (e: string) => void;
}

const NewTaskCard = ({ addTodo, setAddingDay }: NewTaskCardProps) => {
  const [title, setTitle] = useState("");
  const ref = useRef<HTMLFormElement | null>(null);

  const setRef = useCallback((node: HTMLFormElement | null) => {
    if (node) {
      ref.current = node;
    }
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setAddingDay("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <form
      className={styles.addTask}
      ref={setRef}
      action=""
      onSubmit={(e) => {
        e.preventDefault();

        if (title.length > 3) {
          addTodo({
            id: uuidv4(),
            title: title,
            status: "in progress",
          });
          setTitle("");
        }
      }}
    >
      <textarea
        className={"searchInput"}
        placeholder={"Todo title..."}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button disabled={title.length < 4}>Add</button>
    </form>
  );
};

export default NewTaskCard;
