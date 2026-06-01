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
      </div>
    </div>
  );
}

export default TaskCard;