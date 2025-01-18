import { Draggable } from "react-beautiful-dnd";
import { useEffect, useRef, useState } from "react";
import { Task, TaskStatus } from "@/api/types.ts";
import styles from "../task.module.scss";

interface CardProps {
  card: Task;
  index: number;
  onEdit: (item: Task) => void;
  onDelete: () => void;
}

const TaskCard = ({ index, onEdit, onDelete, card }: CardProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState<string>(card.title);
  const [status, setStatus] = useState<TaskStatus>(card.status);
  const ref = useRef<HTMLDivElement | null>(null);

  const edit = () => {
    if (editTitle.length > 3 && status) {
      onEdit({
        ...card,
        title: editTitle,
        status: status,
      });
      setIsEdit(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(card.title);
    setStatus(card.status);
    setIsEdit(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      cancelEdit();
    }
  };

  useEffect(() => {
    if (isEdit) {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isEdit]);

  return (
    <Draggable draggableId={card.id} index={index} isDragDisabled={isEdit}>
      {(provided) => (
        <div
          ref={(node) => {
            provided.innerRef(node);
            ref.current = node;
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.task}
        >
          <div
            className={`${styles.statusRow} ${!isEdit ? styles.disable : ""}`}
          >
            <button
              onClick={() => setStatus("done")}
              className={`${styles.done} ${status === "done" ? styles.active : ""}`}
              disabled={!isEdit}
            >
              Done
            </button>
            <button
              onClick={() => setStatus("in progress")}
              className={`${styles.progress} ${status === "in progress" ? styles.active : ""}`}
              disabled={!isEdit}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatus("canceled")}
              className={`${styles.canceled} ${status === "canceled" ? styles.active : ""}`}
              disabled={!isEdit}
            >
              Canceled
            </button>
          </div>
          {!isEdit ? (
            <p className={styles.title}>{editTitle}</p>
          ) : (
            <textarea
              value={editTitle}
              disabled={!isEdit}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          )}

          {isEdit ? (
            <div className={styles.actionBtns}>
              <button onClick={cancelEdit} className={styles.cancelBtn}>
                <img src={"/close.svg"} alt={"close"} />
              </button>
              <button onClick={edit}>Save</button>
            </div>
          ) : (
            <>
              <button className={styles.delBtn} onClick={onDelete}>
                <img src={"/delete.svg"} alt={"del"} />
              </button>
              <button
                className={styles.editBtn}
                onClick={() => setIsEdit(true)}
              >
                <img src={"/edit.svg"} alt={"edit"} />
              </button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
