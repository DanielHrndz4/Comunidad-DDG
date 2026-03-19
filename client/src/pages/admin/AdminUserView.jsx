// Importa Popup para modales.
import Popup from "reactjs-popup";

// Importa tabla que lista los usuarios.
import UserTable from "../../components/tables/UserTable";

// Importa formulario para crear un nuevo usuario.
import CreateUserForm from "../../components/forms/CreateUserForm";

// Hook para acceder a autenticación y gestión de usuarios desde AuthContext.
import { useAuth } from "../../context/AuthContext";

// Hook de efecto para ejecutar funciones al montar el componente.
import { useEffect } from "react";

// Componente botón reutilizable para crear elementos.
import CreateButton from "../../components/CreateButton";

// Componente de la vista de administración de usuarios.
export default function AdminUserView() {
    
    // Desestructuramos funciones desde el contexto de autenticación.
    const { getAdminUsers, getUsers } = useAuth();

    // Hook de efecto para cargar la lista de usuarios al montar el componente.
    useEffect(() => {
        getUsers();
    }, []);

    return (
        // Contenedor principal con flex vertical centrado y padding.
        <div className="flex grow-1 flex-col justify-start items-center p-16 w-full box-border">

            {/* Encabezado de la sección de usuarios */}
            <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
                <h2 style={{color: "white"}} className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de usuarios
                </h2>
            </div>

            {/* Popup para crear un nuevo usuario */}
            <Popup 
                trigger={<button><CreateButton text="Crear Usuario" /></button>}  // Botón que abre el popup
                lockScroll={true}                                                  // Bloquea scroll de fondo
                position="top center"                                              // Posición del popup
                closeOnDocumentClick={false}                                       // No cierra al click en el overlay
                modal={true}                                                       // Modal
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}                  // Fondo semitransparente
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}              // Contenido con scroll interno
            >
                {/* Formulario de creación de usuario dentro del popup */}
                {close => <CreateUserForm close={close} />}
            </Popup>

            {/* Tabla que muestra todos los usuarios cargados */}
            <UserTable users={getAdminUsers} />
        </div>
    );
}
