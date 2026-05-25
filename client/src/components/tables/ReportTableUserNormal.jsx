import Popup from "reactjs-popup";
import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteReportForm from "../forms/UpdateReportForm";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import { useNavigate } from "react-router";

/**
 * ReportTableUserNormal
 * - Muestra los reportes para un usuario normal (sin permisos de eliminación o edición).
 * - Renderiza cada reporte con su título, descripción, fecha, usuario y la imagen.
 * - Incluye estructura para popup de edición, pero sin botones visibles de editar/eliminar.
 */
export default function ReportTableUserNormal({ reports }) {

    // deleteTask está disponible en el contexto, aunque aquí no se usa
    const { deleteTask } = useTask();

    // Estado del reporte que podría editarse (se mantiene por consistencia con la versión admin)
    const [editing, editReport] = useState();

    // Cierra el popup limpiando el estado
    const closePopup = () => editReport(null);

    // Definición de columnas y tamaños en TableView
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
            {/* TableView: estructura principal de la tabla */}
            <TableView fields={fields}>
                {reports && reports.map(i =>
                    <TableCard key={i._id}>
                        {/* Información visible del reporte */}
                        <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.title}</h2>
                        <p className="text-[1rem] text-light-gray">{i.description}</p>
                        <p className="text-[1rem] text-light-gray">Publicado: {new Date(i.date).toLocaleDateString()}</p>
                        <p className="text-[1rem] text-light-gray">ID usuario: {i.user}</p>

                        {/* Imagen del reporte */}
                        <img className="" src={i.image} alt="Report Image" />

                        {/* Contenedor vacío porque los usuarios normales no tienen acciones */}
                        <span className="flex flex-row gap-16 justify-evenly">
                        </span>
                    </TableCard>
                )}
            </TableView>

            {/* Popup de edición:
                Aunque los usuarios normales no editan, se mantiene por consistencia
                y para posibles cambios futuros. Solo se abre si editing != null */}
            <Popup open={editing != null} onClose={closePopup} lockScroll={true} position="top center" closeOnDocumentClick={false} modal={true}
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }} contentStyle={{ maxHeight: '95%', overflow: 'auto' }}>
                <UpadteReportForm report={editing} close={closePopup} />
            </Popup>
        </>
    );
}
