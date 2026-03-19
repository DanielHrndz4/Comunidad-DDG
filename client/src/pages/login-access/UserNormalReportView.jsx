import Popup from "reactjs-popup";
import ReportTableUserNormal from "../../components/tables/ReportTableUserNormal";
import CreateReportFormUserNormal from "../../components/forms/CreateReportFormUserNormal";
import { useTask } from "../../context/TaskContext";
import { useEffect } from "react";
import CreateButton from "../../components/CreateButton";

export default function UserNormalReportView() {
    // Extraemos las funciones y datos del contexto de tareas
    const { createTask, getTaskAdmin, tasksAdmin } = useTask();

    // Cargar la lista de reportes al montar el componente
    useEffect(() => {
        getTaskAdmin();
    }, []);

    return (
        <div className="flex grow-1 flex-col justify-start items-center p-16 w-full h-content box-border">
            {/* Encabezado de la lista de reportes */}
            <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
                <h2 style={{ color: "white" }} className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de reportes
                </h2>
            </div>

            {/* Botón que abre un modal para crear un nuevo reporte */}
            <Popup 
                trigger={<button><CreateButton text="Crear Reporte" /></button>} 
                lockScroll={true}
                position="top center" 
                closeOnDocumentClick={false} 
                modal={true} 
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}
            >
                {close => <CreateReportFormUserNormal close={close} />}
            </Popup>

            {/* Tabla que muestra los reportes existentes */}
            <ReportTableUserNormal reports={tasksAdmin} />
        </div>
    );
}
