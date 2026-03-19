import Popup from "reactjs-popup";
import TaskTableUserNormal from "../../components/tables/TaskTableUserNormal";
import CreateTaskFormUserNormal from "../../components/forms/CreateTaskFormUserNormal";
import { useTask } from "../../context/TaskContext";
import { useEffect } from "react";
import CreateButton from "../../components/CreateButton";

export default function UserNormalAnunciosView() {
    // Obtenemos las tareas/anuncios del contexto
    const { getTaskAdmin2, tasksAdmin2 } = useTask();

    // Cargar los anuncios al montar el componente
    useEffect(() => {
        getTaskAdmin2();
    }, []);

    return (
        <div className="flex grow-1 flex-col justify-start items-center p-16 w-full h-content box-border">
            {/* Encabezado de la lista de anuncios */}
            <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
                <h2 style={{ color: "white" }} className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de anuncios
                </h2>
            </div>

            {/* Botón para crear un nuevo anuncio en un popup */}
            <Popup 
                trigger={<button><CreateButton text="Crear Anuncio" /></button>} 
                lockScroll={true}
                position="top center" 
                closeOnDocumentClick={false} 
                modal={true} 
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}
            >
                {close => <CreateTaskFormUserNormal close={close} />}
            </Popup>

            {/* Tabla que muestra los anuncios */}
            <TaskTableUserNormal tasks={tasksAdmin2} />
        </div>
    );
}
