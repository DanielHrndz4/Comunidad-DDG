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

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700">
            <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i) => {
            const userId = i._id ?? i.id;

            return (
              <tr 
                key={userId ?? i.email} 
                className="border-b border-slate-700 transition-colors duration-200 hover:bg-slate-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <span className="text-emerald-400 font-bold text-sm">
                        {i.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{i.username}</div>
                      <div className="text-slate-400 text-xs mt-0.5">ID: {userId?.substring(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-slate-300 text-sm">{i.email}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="inline-flex items-center justify-center bg-transparent text-red-500 border border-red-950 hover:bg-red-500/15 hover:border-red-500/50 px-2.5 py-1.5 rounded-md transition-all duration-200"
                    title="Eliminar usuario"
                    onClick={async () => {
                      if (!userId) {
                        Swal.fire({
                          title: "Error",
                          text: "No se encontró el identificador del usuario.",
                          icon: "error",
                          background: "#1c1c1c",
                          color: "white",
                          confirmButtonColor: "#3ecf8e",
                        });
                        return;
                      }

                      const confirm = await Swal.fire({
                        title: "¿Eliminar usuario?",
                        text: "Esta acción no se puede deshacer.",
                        icon: "warning",
                        showCancelButton: true,
                        background: "#1c1c1c",
                        color: "white",
                        confirmButtonColor: "#ef4444",
                        cancelButtonColor: "#2e2e2e",
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
                            background: "#1c1c1c",
                            color: "white",
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
                            background: "#1c1c1c",
                            color: "white",
                            confirmButtonColor: "#ef4444",
                          });
                        }
                      }
                    }}
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}