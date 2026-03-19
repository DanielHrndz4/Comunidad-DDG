import "./TaskCard2.css";

function TaskCard2({tasks2}) {
    return (
        <div className="task-card-container">
            <div className="card">
                <h2>Titulo: {tasks2.title2}</h2>
                <p>Descripción: {tasks2.description2}</p>
                <p>Fecha de publicación: {new Date(tasks2.date2).toLocaleDateString()}</p>
                <p>ID usuario: {tasks2.user}</p>
                <div className="imagen-card">
                    <img src={tasks2.image} width={200} height={200} />
                </div>
            </div>
        </div>
    )
}

export default TaskCard2;