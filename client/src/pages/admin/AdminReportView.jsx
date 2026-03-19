// Importa Popup para modales.
import Popup from "reactjs-popup";

// Importa tabla que lista los reportes.
import ReportTable from "../../components/tables/ReportTable";

// Importa formulario para crear un nuevo reporte.
import CreateReportForm from "../../components/forms/CreateReportForm";

// Hook para acceder a tareas desde TaskContext.
import { useTask } from "../../context/TaskContext";

// Hook de efecto para ejecutar funciones al montar el componente.
import { useEffect } from "react";

// Componente botón reutilizable para crear elementos.
import CreateButton from "../../components/CreateButton";

// Componente de la vista de administración de reportes.
export default function AdminReportView() {

    // Desestructuramos tareas de admin y función para obtenerlas desde TaskContext.
    const { tasksAdmin, getTaskAdmin } = useTask();

    // Hook de efecto para cargar los reportes cuando el componente se monta.
    useEffect(() => {
        getTaskAdmin();
    }, []);

    return (
        // Contenedor principal con flex vertical centrado y padding.
        <div className="flex grow-1 flex-col justify-start items-center p-16 w-full h-content box-border">

            {/* Encabezado de la sección de reportes */}
            <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
                <h2 style={{color: "white"}} className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de reportes
                </h2>
            </div>

            {/* Popup para crear un nuevo reporte */}
            <Popup 
                trigger={<button><CreateButton text="Crear Reporte" /></button>}  // Botón que abre el popup
                lockScroll={true}                                                  // Bloquea scroll de fondo
                position="top center"                                              // Posición del popup
                closeOnDocumentClick={false}                                       // No cierra al click en el overlay
                modal={true}                                                       // Modal
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}                  // Fondo semitransparente
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}              // Contenido con scroll interno
            >
                {/* Formulario de creación de reportes dentro del popup */}
                {close => <CreateReportForm close={close} />}
            </Popup>

            {/* Tabla que muestra todos los reportes cargados */}
            <ReportTable reports={tasksAdmin} />
        </div>
    );
}
