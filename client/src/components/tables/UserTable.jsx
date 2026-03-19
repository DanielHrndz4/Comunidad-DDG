import { MdDelete } from "react-icons/md";
import TableCard from "./TableRow";
import TableView from "./TableView";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function UserTable({ users }) {
    // Obtiene la función deleteUser desde el contexto de autenticación
    const { deleteUser } = useAuth();

    // Hook para redireccionar después de eliminar
    const navigate = useNavigate();

    // Configuración de columnas y tamaños para la tabla
    const fields = {
        username: { width: 300 },
        email: { width: 300 },
        delete: { width: 50 }
    };

    return (
        <TableView fields={fields}>
            {users.map(i =>
                // Componente que representa una fila por usuario
                <TableCard key={i.id}>

                    {/* Nombre del usuario */}
                    <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.username}</h2>

                    {/* Correo del usuario */}
                    <p className="text-[1rem] text-light-gray font-bold">{i.email}</p>

                    {/* Botón de eliminar usuario */}
                    <button className="bg-custom-red text-white py-11 px-16 rounded-[8px]
                        cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                        hover:bg-dark-red"
                        onClick={async () => {
                            // Confirmación con SweetAlert antes de eliminar
                            const confirm = await Swal.fire({
                                title: "¿Eliminar usuario?",
                                text: "Esta acción no se puede deshacer.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Sí, eliminar",
                                cancelButtonText: "Cancelar",
                            });

                            // Si el administrador confirma la eliminación
                            if (confirm.isConfirmed) {
                                try {
                                    // Se llama a la función para eliminar el usuario
                                    await deleteUser(i.id);

                                    // Notificación de éxito
                                    await Swal.fire({
                                        title: "Eliminado",
                                        text: "El usuario se ha eliminado correctamente.",
                                        icon: "success",
                                        showConfirmButton: false,
                                        timer: 2000,
                                        timerProgressBar: true,
                                    });

                                    // Pequeña espera antes de redirigir
                                    await new Promise((resolve) => setTimeout(resolve, 600));

                                    // Redirige al panel de administrador
                                    navigate("/admin");

                                } catch (err) {
                                    // Manejo de errores en caso de que la eliminación falle
                                    console.error(err);
                                    Swal.fire({
                                        title: "Error",
                                        text: "Ocurrió un error al eliminar al usuario.",
                                        icon: "error",
                                        confirmButtonColor: "#d33",
                                    });
                                }
                            }
                        }}>
                        {/* Ícono de eliminar */}
                        <MdDelete />
                    </button>
                </TableCard>
            )}
        </TableView>
    );
}
