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

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="card-panel w-full">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">{task.title}</h2>
          <p className="text-sm text-slate-300">{task.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Publicado:</span>{' '}
            {new Date(task.date).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Usuario ID:</span>{' '}
            {task.user}
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 shadow-lg">
          <img src={task.image} alt={task.title} className="h-72 w-full object-cover" />
        </div>
      </div>
    </article>
  );
}
