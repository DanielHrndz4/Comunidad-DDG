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
    <div className="w-full">
      <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-start duration-300 ease-in-out border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:bg-white/10 hover:border-white/20 relative group">
        <h2 className="text-xl font-bold text-gray-100 mb-2">{task.title}</h2>

        <p className="text-gray-300 mb-4">{task.description}</p>

        <p className="text-sm text-gray-500 mb-1">
          <span className="font-semibold text-gray-400">Publicado:</span>{" "}
          {new Date(task.date).toLocaleDateString()}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-400">Usuario ID:</span> {task.user}
        </p>

        <div className="w-full flex justify-center mt-2 mb-4 rounded-xl overflow-hidden shadow-lg border border-white/5">
          <img
            src={task.image}
            className="w-full object-cover max-h-48"
            alt={task.title}
          />
        </div>

        <div className="flex gap-4 w-full justify-end mt-2 pt-4 border-t border-white/10">
          <Link 
            to={`/task/${task._id}`}
            className="text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 p-2 rounded-lg hover:bg-indigo-500/20"
          >
            <MdModeEdit size={24} />
          </Link>
          <button
            type="button"
            className="text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 p-2 rounded-lg hover:bg-rose-500/20 cursor-pointer border-none"
            onClick={() => {
              deleteTask(task._id);
            }}
          >
            <MdDelete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}