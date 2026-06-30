interface TaskItem2 {
  title2: string;
  description2: string;
  date2: string;
  user: string;
  image: string;
}

interface TaskCard2Props {
  tasks2: TaskItem2;
}

function TaskCard2({
  tasks2,
}: TaskCard2Props) {
  return (
    <div className="w-full">
      <div className="glass-panel p-24 flex flex-col items-start hover:-translate-y-4 duration-300">
        <h2 className="font-display text-20 font-bold text-white mb-8">{tasks2.title2}</h2>

        <p className="text-15 text-gray-300 mb-16">{tasks2.description2}</p>

        <p className="text-12 text-gray-400 mb-4">
          <span className="font-semibold text-gray-400">Fecha de publicación:</span>{" "}
          {new Date(tasks2.date2).toLocaleDateString()}
        </p>

        <p className="text-12 text-gray-400 mb-16">
          <span className="font-semibold text-gray-400">ID usuario:</span> {tasks2.user}
        </p>

        <div className="w-full flex justify-center mt-8 rounded-12 overflow-hidden shadow-lg border border-white/5">
          <img
            src={tasks2.image}
            className="w-full object-cover max-h-192"
            alt={tasks2.title2}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskCard2;