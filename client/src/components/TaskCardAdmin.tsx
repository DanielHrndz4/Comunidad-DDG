import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { MdModeEdit, MdDelete } from "react-icons/md";

import { useTask } from "../context/TaskContext";
import "./TaskCard.css";

interface TaskItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  user: string;
  image: string;
}

interface TaskCardAdminProps {
  task: TaskItem;
}

interface TaskFormValues {
  title: string;
  description: string;
}

export default function TaskCardAdmin({
  task,
}: TaskCardAdminProps) {
  const { setValue } = useForm<TaskFormValues>();

  const { oneTask, deleteTask } = useTask();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function loadTask(): Promise<void> {
      if (params.id) {
        const loadedTask = await oneTask(params.id);

        if (loadedTask) {
          setValue("title", loadedTask.title);
          setValue("description", loadedTask.description);
        }
      }
    }

    loadTask();
  }, [params.id, oneTask, setValue]);

  return (
    <div>
      <div className="task-card-container">
        <div className="card">
          <h2>Titulo: {task.title}</h2>

          <p>Descripción: {task.description}</p>

          <p>
            Fecha de publicación:{" "}
            {new Date(task.date).toLocaleDateString()}
          </p>

          <p>ID usuario: {task.user}</p>

          <div className="imagen-card">
            <img
              src={task.image}
              width={200}
              height={200}
              alt={task.title}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                deleteTask(task._id);
              }}
            >
              <MdDelete />
            </button>

            <Link to={`/task/${task._id}`}>
              <MdModeEdit />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}