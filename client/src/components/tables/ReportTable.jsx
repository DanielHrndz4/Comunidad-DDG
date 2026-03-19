import { MdDelete, MdModeEdit } from "react-icons/md";
import Popup from "reactjs-popup";
import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteReportForm from "../forms/UpdateReportForm";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

/**
 * ReportTable
 * - Muestra una tabla/listado de reportes recibidos por prop `reports`.
 * - Permite eliminar o editar cada reporte.
 * - Usa TaskContext para acciones (deleteTask) y react-router para navegación.
 */
export default function ReportTable({ reports }) {
    // Acción del contexto para eliminar tareas/reportes
    const { deleteTask } = useTask();

    // Estado local para el reporte que está en edición (se pasa al Popup)
    const [editing, editReport] = useState();

    // Función para cerrar el popup de edición (limpia el state)
    const closePopup = () => editReport(null);

    // Hook para redirigir tras acciones (ej. volver al listado)
    const navigate = useNavigate();

    // Definición de campos y anchos para TableView (estructura visual)
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
            {/* TableView: layout general de la tabla */}
            <TableView fields={fields}>
                {reports.map(i =>
                    <TableCard key={i._id}>
                        {/* Contenido de cada fila / tarjeta */}
                        <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.title}</h2>
                        <p className="text-[1rem] text-light-gray">{i.description}</p>
                        <p className="text-[1rem] text-light-gray">Publicado: {new Date(i.date).toLocaleDateString()}</p>
                        <p className="text-[1rem] text-light-gray">ID usuario: {i.user}</p>
                        <img className="" src={i.image} alt="Report Image" />

                        {/* Botones de acción: eliminar y editar */}
                        <span className="flex flex-row gap-16 justify-evenly">
                            {/* Botón Eliminar */}
                            <button className="bg-custom-red text-white py-11 px-16 rounded-[8px]
                        cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                        hover:bg-dark-red"
                                onClick={async () => {
                                    // Confirma con el usuario antes de eliminar usando SweetAlert2
                                    const confirm = await Swal.fire({
                                        title: "¿Eliminar publicación?",
                                        text: "Esta acción no se puede deshacer.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#d33",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, eliminar",
                                        cancelButtonText: "Cancelar",
                                    });

                                    // Si confirma, llama a deleteTask y notifica el resultado
                                    if (confirm.isConfirmed) {
                                        try {
                                            await deleteTask(i._1d || i._id); // <-- mantiene tu llamada original (i._id)
                                            await Swal.fire({
                                                title: "Eliminado",
                                                text: "La publicación se ha eliminado correctamente.",
                                                icon: "success",
                                                showConfirmButton: false,
                                                timer: 1500,
                                                timerProgressBar: true,
                                            });

                                            // Pequeña espera y navegación al listado/admin
                                            await new Promise((resolve) => setTimeout(resolve, 500));
                                            navigate("/admin");

                                        } catch (err) {
                                            // Si ocurre un error al eliminar, muestra alerta
                                            console.error(err);
                                            Swal.fire({
                                                title: "Error",
                                                text: "Ocurrió un error al eliminar la publicación.",
                                                icon: "error",
                                                confirmButtonColor: "#d33",
                                            });
                                        }
                                    }
                                }}>
                                <MdDelete />
                            </button>

                            {/* Botón Editar: abre el popup pasando el reporte a editar */}
                            <button className="bg-custom-blue text-white py-11 px-16 rounded-[8px]
                        cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                        hover:bg-dark-blue"
                                onClick={() => { editReport(i) }}>
                                <MdModeEdit />
                            </button>

                        </span>

                    </TableCard>
                )}
            </TableView>

            {/* Popup modal para editar el reporte.
                - Se abre cuando `editing` no es null.
                - Contiene el formulario UpdateReportForm que recibe `report` y `close`. */}
            <Popup open={editing != null} onClose={closePopup} lockScroll={true} position="top center" closeOnDocumentClick={false} modal={true}
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }} contentStyle={{ maxHeight: '95%', overflow: 'auto' }}>
                <UpadteReportForm report={editing} close={closePopup} />
            </Popup>
        </>

    );
}
