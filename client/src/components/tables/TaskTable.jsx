import { MdDelete, MdModeEdit } from "react-icons/md";
import Popup from "reactjs-popup";
import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteTaskForm from "../forms/UpdateTaskForm";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

/**
 * TaskTable
 * - Muestra todos los anuncios (tasks)
 * - Permite editarlos y eliminarlos (solo admin)
 * - Abre un popup con formulario al editar
 * - Pide confirmación al eliminar mediante SweetAlert2
 */
export default function TaskTable({ tasks }) {

    // deleteTask2 viene del contexto de tareas
    const { deleteTask2 } = useTask();

    // Estado para guardar la tarea que se está editando
    const [editing, editTask] = useState();

    // Cierra popup limpiando el estado
    const closePopup = () => editTask(null);

    // Para redirigir luego de eliminar
    const navigate = useNavigate();

    // Columnas usadas por TableView
    const fields = {
        title: { width: 300 },
        desc: { width: 300 },
        date: { width: 300 },
        user: { width: 300 },
        image: { width: 300 },
        delete: { width: 50 }
    };

    return (
        <>
            {/* Tabla completa */}
            <TableView fields={fields}>
                {tasks.map(i =>
                    <TableCard key={i._id}>
                        
                        {/* Información principal del anuncio */}
                        <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.title2}</h2>
                        <p className="text-[1rem] text-light-gray">{i.description2}</p>
                        <p className="text-[1rem] text-light-gray">
                            Publicados: {new Date(i.date2).toLocaleDateString()}
                        </p>
                        <p className="text-[1rem] text-light-gray">ID usuario: {i.user}</p>

                        {/* Imagen del anuncio */}
                        <img className="" src={i.image} alt="Task Image" />

                        {/* Botones de acción: eliminar y editar */}
                        <span className="flex flex-row gap-16 justify-evenly">

                            {/* BOTÓN ELIMINAR */}
                            <button
                                className="bg-custom-red text-white py-11 px-16 rounded-[8px]
                                cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                                hover:bg-dark-red"
                                onClick={async () => {
                                    // Confirmación antes de eliminar
                                    const confirm = await Swal.fire({
                                        title: "¿Eliminar anuncio?",
                                        text: "Esta acción no se puede deshacer.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#d33",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, eliminar",
                                        cancelButtonText: "Cancelar",
                                    });

                                    if (confirm.isConfirmed) {
                                        try {
                                            // Ejecuta eliminación desde el contexto
                                            await deleteTask2(i._id);

                                            // Mensaje de éxito
                                            await Swal.fire({
                                                title: "Eliminado",
                                                text: "El anuncio se ha eliminado correctamente.",
                                                icon: "success",
                                                showConfirmButton: false,
                                                timer: 1500,
                                                timerProgressBar: true,
                                            });

                                            // Espera para evitar que el popup se cierre abruptamente
                                            await new Promise((resolve) => setTimeout(resolve, 500));

                                            // Redirige hacia admin
                                            navigate("/admin");

                                        } catch (err) {
                                            console.error(err);

                                            // Mensaje de error
                                            Swal.fire({
                                                title: "Error",
                                                text: "Ocurrió un error al eliminar el anuncio.",
                                                icon: "error",
                                                confirmButtonColor: "#d33",
                                            });
                                        }
                                    }
                                }}
                            >
                                <MdDelete />
                            </button>

                            {/* BOTÓN EDITAR */}
                            <button
                                className="bg-custom-blue text-white py-11 px-16 rounded-[8px]
                                cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                                hover:bg-dark-blue"
                                onClick={() => { editTask(i) }} // abre el popup con la task actual
                            >
                                <MdModeEdit />
                            </button>

                        </span>

                    </TableCard>
                )}
            </TableView>

            {/* POPUP PARA EDITAR UNA TAREA */}
            <Popup
                open={editing != null}
                onClose={closePopup}
                lockScroll={true}
                position="top center"
                closeOnDocumentClick={false}
                modal={true}
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}
            >
                <UpadteTaskForm task={editing} close={closePopup} />
            </Popup>
        </>
    );
}
