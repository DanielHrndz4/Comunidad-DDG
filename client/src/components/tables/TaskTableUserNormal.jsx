import Popup from "reactjs-popup";
import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteTaskForm from "../forms/UpdateTaskForm";
import { useState } from "react";

/**
 * TaskTableUserNormal
 * - Muestra los anuncios (tasks) visibles para un usuario normal.
 * - No permite editar ni eliminar.
 * - Renderiza una tabla con información de cada tarea.
 * - Mantiene el popup y estado de edición por consistencia, pero no se usa ya que no hay botones.
 */
export default function TaskTableUserNormal({ tasks }) {

    // Estado que guarda la tarea que se está editando (aunque los usuarios normales no editan)
    const [editing, editTask] = useState();

    // Función para cerrar el popup
    const closePopup = () => editTask(null);

    // Definición de columnas de la tabla
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
            {/* Componente principal de la tabla */}
            <TableView fields={fields}>
                {tasks.map(i =>
                    <TableCard key={i._id}>
                        
                        {/* Título del anuncio */}
                        <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.title2}</h2>

                        {/* Descripción del anuncio */}
                        <p className="text-[1rem] text-light-gray">{i.description2}</p>

                        {/* Fecha de publicación */}
                        <p className="text-[1rem] text-light-gray">
                            Publicado: {new Date(i.date2).toLocaleDateString()}
                        </p>

                        {/* ID del usuario que creó el anuncio */}
                        <p className="text-[1rem] text-light-gray">ID usuario: {i.user}</p>

                        {/* Imagen asociada a la tarea */}
                        <img className="" src={i.image} alt="Task Image" />

                        {/* Espacio reservado para acciones, pero vacío porque usuario normal no edita */}
                        <span className="flex flex-row gap-16 justify-evenly"></span>

                    </TableCard>
                )}
            </TableView>

            {/* Popup de edición (no se utiliza por el usuario normal, pero está presente por compatibilidad) */}
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
