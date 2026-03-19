// Importa el archivo de estilos CSS específico para el componente TaskCard.
// Este archivo contiene las reglas visuales que afectan únicamente a este componente.
import "./TaskCard.css";

// Componente funcional 'TaskCard'.
// Recibe una prop llamada 'task', que es un objeto con información de una tarea:
// title, description, date, user e image.
function TaskCard({ task }) {
    return (
        // Contenedor principal de la tarjeta, utilizado para manejar
        // la disposición y estilo general mediante la clase 'task-card-container'.
        <div className="task-card-container">

            {/* Tarjeta interna que muestra los datos de la tarea. */}
            <div className="card">

                {/* Título de la tarea. */}
                <h2>Titulo: {task.title}</h2>

                {/* Descripción de la tarea. */}
                <p>Descripción: {task.description}</p>

                {/* Fecha formateada usando toLocaleDateString().
                    'task.date' debe ser una fecha válida. */}
                <p>Fecha de publicación: {new Date(task.date).toLocaleDateString()}</p>

                {/* Identificador del usuario asociado a la tarea. */}
                <p>ID usuario: {task.user}</p>

                {/* Contenedor de la imagen de la tarea.
                    Muestra la imagen definida en task.image con tamaño fijo. */}
                <div className="imagen-card">
                    <img src={task.image} width={200} height={200} />
                </div>
            </div>
        </div>
    )
}

// Exporta el componente para ser usado en otras partes de la aplicación.
export default TaskCard;
