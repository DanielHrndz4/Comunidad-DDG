import UserNormalTable from "../../components/tables/UserNormalTable";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function UserNormalView() {
    // Extraemos del contexto las funciones y datos de usuarios
    const { getAllUsers, users } = useAuth();

    // Cargar la lista de usuarios cuando se monta el componente
    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    return (
        <div className="flex grow-1 flex-col justify-start items-center p-16 w-full box-border">
            {/* Encabezado de la lista de usuarios */}
            <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
                <h2 style={{ color: "white" }} className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de usuarios
                </h2>
            </div>

            {/* Tabla que muestra todos los usuarios */}
            {/* NOTA: Pasamos el array 'users', no la función */}
            <UserNormalTable users={users} />
        </div>
    );
}
