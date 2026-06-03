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
    <div style={{ width: "100%", maxWidth: "1000px", margin: "24px auto 0", overflowX: "auto", borderRadius: "8px", border: "1px solid #2e2e2e", backgroundColor: "#1c1c1c", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)" }}>
      <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#232323", borderBottom: "1px solid #2e2e2e" }}>
            <th style={{ padding: "12px 24px", fontSize: "12px", fontWeight: "600", color: "#8b8b8b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Usuario</th>
            <th style={{ padding: "12px 24px", fontSize: "12px", fontWeight: "600", color: "#8b8b8b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
            <th style={{ padding: "12px 24px", fontSize: "12px", fontWeight: "600", color: "#8b8b8b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i) => {
            const userId = i._id ?? i.id;

            return (
              <tr 
                key={userId ?? i.email} 
                style={{ borderBottom: "1px solid #2e2e2e", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(62, 207, 142, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(62, 207, 142, 0.2)" }}>
                      <span style={{ color: "#3ecf8e", fontWeight: "bold", fontSize: "16px" }}>
                        {i.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div style={{ color: "#ededed", fontWeight: "500", fontSize: "14px" }}>{i.username}</div>
                      <div style={{ color: "#8b8b8b", fontSize: "12px", marginTop: "2px" }}>ID: {userId?.substring(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                
                <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                  <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{i.email}</span>
                </td>
                
                <td style={{ padding: "16px 24px", whiteSpace: "nowrap", textAlign: "right" }}>
                  <button
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: "transparent",
                      color: "#ef4444",
                      border: "1px solid #451a1a",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#451a1a"; }}
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