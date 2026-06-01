import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import TableCard from "./TableRow";
import TableView from "./TableView";
import { useAuth } from "../../context/AuthContext";
import type { IUser } from "../../interfaces/IUser";

interface UserTableProps {
  users: IUser[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

export default function UserTable({
  users,
}: UserTableProps) {
  const { deleteUser } = useAuth();
  const navigate = useNavigate();

  const fields: TableFields = {
    username: { width: 300 },
    email: { width: 300 },
    delete: { width: 50 },
  };

  return (
    <TableView fields={fields}>
      {users.map((i) => {
        const userId = i._id ?? i.id;

        return (
          <TableCard key={userId ?? i.email}>
            <h2 className="text-[1.5rem] text-dark-gray font-bold">
              {i.username}
            </h2>

            <p className="text-[1rem] text-light-gray font-bold">
              {i.email}
            </p>

            <button
              className="bg-custom-red text-white py-11 px-16 rounded-[8px]
              cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
              hover:bg-dark-red"
              onClick={async () => {
                if (!userId) {
                  Swal.fire({
                    title: "Error",
                    text: "No se encontró el identificador del usuario.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                  });
                  return;
                }

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

                if (confirm.isConfirmed) {
                  try {
                    await deleteUser(userId);

                    await Swal.fire({
                      title: "Eliminado",
                      text: "El usuario se ha eliminado correctamente.",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true,
                    });

                    await new Promise((resolve) =>
                      setTimeout(resolve, 600)
                    );

                    navigate("/admin");
                  } catch (err) {
                    console.error(err);

                    Swal.fire({
                      title: "Error",
                      text: "Ocurrió un error al eliminar al usuario.",
                      icon: "error",
                      confirmButtonColor: "#d33",
                    });
                  }
                }
              }}
            >
              <MdDelete />
            </button>
          </TableCard>
        );
      })}
    </TableView>
  );
}