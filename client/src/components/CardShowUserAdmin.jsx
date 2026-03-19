import { MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "./AdminDeleteUser.css";

// Componente que muestra la tarjeta de un usuario en el panel de administración.
// Recibe un objeto "user" como propiedad.
export default function CardShowUserAdmin({user}) {
    
    // Obtiene la función deleteUser desde el contexto de autenticación.
    // Esta función permite eliminar un usuario por su ID.
    const { deleteUser } = useAuth();

    return(
        <div>
            {/* Contenedor principal de la tarjeta del usuario */}
            <div className="card">

                {/* Nombre del usuario */}
                <h2>{user.name}</h2>

                {/* Correo del usuario */}
                <p>{user.email}</p>

                {/* Botón para eliminar al usuario */}
                {/* Al hacer clic, se ejecuta deleteUser enviando el ID del usuario */}
                <button onClick={() => { deleteUser(user.id)}}>
                    <MdDelete />
                </button>

            </div>
        </div>
    );
};
