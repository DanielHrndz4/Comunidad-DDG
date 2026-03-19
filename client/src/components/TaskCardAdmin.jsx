// Importa el hook useTask desde el contexto de tareas, que provee funciones
// para obtener, actualizar y eliminar tareas.
import { useTask } from "../context/TaskContext";

// Importa íconos de edición y eliminación desde react-icons.
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

// Importa herramientas de enrutamiento: useParams para leer parámetros de URL y Link para navegación.
import { useParams, Link } from "react-router";

// Importa useForm de react-hook-form para manejar formularios.
// En este caso solo se usa setValue para llenar campos.
import { useForm } from "react-hook-form";

// Importa useEffect para manejar efectos secundarios, como obtener datos al cargar.
import { useEffect } from "react";

// Importa estilos locales del componente.
import "./TaskCard.css";

// Componente TaskCardAdmin: tarjeta de administración de tareas.
// Recibe 'task' como prop, que contiene datos de la tarea (título, descripción, etc.)
function TaskCardAdmin({ task }) {

    // Obtiene la función setValue de react-hook-form para precargar valores en un formulario.
    const { setValue } = useForm();

    // Obtiene funciones del contexto de tareas: obtener una, eliminar y actualizar.
    const { oneTask, deleteTask, updateTask } = useTask();

    // Obtiene parámetros dinámicos de la URL, por ejemplo el ID de la tarea.
    const params = useParams();

    // Función auxiliar para recargar la página completa.
    const handleReload = () => {
        window.location.reload();
    };

    // useEffect ejecutado al montar el componente.
    // Si existe un ID en los parámetros, carga la tarea correspondiente.
    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const task = await oneTask(params.id);
                console.log(task);

                // Rellena valores del formulario con la información de la tarea.
                setValue("title", task.title);
                setValue("description", task.description);
            }
        }
        loadTask();
    }, []); // Dependencias vacías: se ejecuta solo una vez.

    return (
        <div>
            <div className="task-card-container">
                <div className="card">

                    {/* Información básica de la tarea */}
                    <h2>Titulo: {task.title}</h2>
                    <p>Descripción: {task.description}</p>
                    <p>Fecha de publicación: {new Date(task.date).toLocaleDateString()}</p>
                    <p>ID usuario: {task.user}</p>

                    {/* Imagen asociada a la tarea */}
                    <div className="imagen-card">
                        <img src={task.image} width={200} height={200} />
                    </div>

                    {/* Controles administrativos: eliminar y editar */}
                    <div>

                        {/* Botón para eliminar la tarea. Llama a deleteTask con el ID */}
                        <button type="submit" onClick={() => { deleteTask(task._id) }}>
                            <MdDelete />
                        </button>

                        {/* Enlace para navegar al formulario de edición de la tarea */}
                        <Link to={`/task/${task._id}`}>
                            <MdModeEdit />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Exporta el componente para uso externo.
export default TaskCardAdmin;
