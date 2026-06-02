import { MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "./AdminDeleteUser.css";

interface UserCardAdminProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Componente que muestra la tarjeta de un usuario en el panel de administración.
export default function CardShowUserAdmin({
  user,
}: UserCardAdminProps) {
  // Obtiene la función deleteUser desde el contexto de autenticación.
  const { deleteUser } = useAuth();

  return (
    <div>
      <div className="card">
        <h2>{user.name}</h2>

        <p>{user.email}</p>

        <button
          onClick={() => {
            deleteUser(user.id);
          }}
        >
          <MdDelete />
        </button>
      </div>
    </div>
  );
}