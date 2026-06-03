import "./TaskCard.css";

interface TaskItem {
  title: string;
  description: string;
  date: string;
  user: string;
  image: string;
}

interface TaskCardProps {
  task: TaskItem;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="w-full">
      <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-start duration-300 ease-in-out border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:bg-white/10 hover:border-white/20">
        <h2 className="text-xl font-bold text-gray-100 mb-2">{task.title}</h2>

        <p className="text-gray-300 mb-4">{task.description}</p>

        <p className="text-sm text-gray-500 mb-1">
          <span className="font-semibold text-gray-400">Publicado:</span>{" "}
          {new Date(task.date).toLocaleDateString()}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-400">Usuario ID:</span> {task.user}
        </p>

        <div className="w-full flex justify-center mt-2 rounded-xl overflow-hidden shadow-lg border border-white/5">
          <img
            src={task.image}
            className="w-full object-cover max-h-48"
            alt={task.title}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskCard;