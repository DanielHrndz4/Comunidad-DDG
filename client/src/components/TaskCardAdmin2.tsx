import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link } from "react-router";
import { MdModeEdit, MdDelete } from "react-icons/md";

import { useTask } from "../context/TaskContext";

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
    <div className="w-full">
      <div className="glass-panel p-24 flex flex-col items-start hover:-translate-y-4 duration-300 relative group">
        <h2 className="font-display text-20 font-bold text-white mb-8">{task.title2}</h2>

        <p className="text-15 text-gray-300 mb-16">{task.description2}</p>

        <p className="text-12 text-gray-400 mb-4">
          <span className="font-semibold text-gray-400">Fecha de publicación:</span>{" "}
          {new Date(task.date2).toLocaleDateString()}
        </p>

        <p className="text-12 text-gray-400 mb-16">
          <span className="font-semibold text-gray-400">ID usuario:</span> {task.user}
        </p>

        <div className="w-full flex justify-center mt-8 mb-16 rounded-12 overflow-hidden shadow-lg border border-white/5">
          <img
            src={task.image}
            className="w-full object-cover max-h-192"
            alt={task.title2}
          />
        </div>

        <div className="flex gap-16 w-full justify-end mt-8 pt-16 border-t border-white/10">
          <Link 
            to={`/taskd/${task._id}`}
            className="text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 p-8 rounded-8 hover:bg-indigo-500/20"
          >
            <MdModeEdit size={24} />
          </Link>
          <button
            type="button"
            className="text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 p-8 rounded-8 hover:bg-rose-500/20 cursor-pointer border-none"
            onClick={() => {
              deleteTask2(task._id);
            }}
          >
            <MdDelete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCardAdmin;