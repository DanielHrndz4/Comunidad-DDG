import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link } from "react-router";
import { MdModeEdit, MdDelete } from "react-icons/md";

import { useTask } from "../context/TaskContext";
import "./TaskCard.css";

interface TaskItem2 {
  _id: string;
  title2: string;
  description2: string;
  date2: string;
  user: string;
  image: string;
}

interface TaskCardAdminProps {
  task: TaskItem2;
}

interface TaskFormValues {
  title: string;
  description: string;
}

function TaskCardAdmin({
  task,
}: TaskCardAdminProps) {
  const { setValue } = useForm<TaskFormValues>();

  const { oneTask2, deleteTask2 } = useTask();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function loadTask(): Promise<void> {
      if (params.id) {
        const loadedTask = await oneTask2(params.id);

        if (loadedTask) {
          setValue("title", loadedTask.title2);
          setValue("description", loadedTask.description2);
        }
      }
    }

    loadTask();
  }, [params.id, oneTask2, setValue]);

  return (
    <div>
      <div className="task-card-container">
        <div className="card">
          <h2>Titulo: {task.title2}</h2>

          <p>Descripción: {task.description2}</p>

          <p>
            Fecha de publicación:{" "}
            {new Date(task.date2).toLocaleDateString()}
          </p>

          <p>ID usuario: {task.user}</p>

          <div className="imagen-card">
            <img
              src={task.image}
              width={200}
              height={200}
              alt={task.title2}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                deleteTask2(task._id);
              }}
            >
              <MdDelete />
            </button>

            <Link to={`/taskd/${task._id}`}>
              <MdModeEdit />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCardAdmin;