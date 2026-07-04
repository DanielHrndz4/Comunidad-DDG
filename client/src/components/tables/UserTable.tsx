import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { IUser, UserRole } from "../../interfaces/IUser";
import "./ListPages.css";

interface UserTableProps {
  users: IUser[];
}

export default function UserTable({ users = [] }: UserTableProps) {
  const { deleteUser, user, updateProfile } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="ddg-list-container">
      <div className="ddg-card-grid">
        {users?.length > 0 ? (
          users.map((i) => {
            const userId = i._id ?? i.id;
            const displayName = i.name || i.username || "Usuario";
            const initial = displayName.charAt(0).toUpperCase();

            return (
              <div key={userId ?? i.email} className="ddg-premium-card" style={{ minHeight: "260px" }}>
                {/* Card Content */}
                <div className="ddg-card-content" style={{ height: "100%" }}>
                  <div className="ddg-card-main-info" style={{ alignItems: "center", textAlign: "center" }}>
                    {/* Stylized Big Avatar */}
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2dbda1 0%, #239c84 100%)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "700",
                        marginBottom: "12px",
                        boxShadow: "0 8px 20px rgba(45, 189, 161, 0.25)",
                      }}
                    >
                      {initial}
                    </div>

                    <span className="ddg-card-meta" style={{ letterSpacing: "1px" }}>
                      Miembro DDG
                    </span>
                    <h3 className="ddg-card-title">{displayName}</h3>
                    <p className="ddg-card-description" style={{ fontSize: "13px", wordBreak: "break-all" }}>
                      {i.email}
                    </p>
                  </div>

                  <div className="ddg-card-footer" style={{ marginTop: "16px" }}>
                    {isAdmin ? (
                      <select
                        value={i.role || "normal"}
                        onChange={async (e) => {
                          const newRole = e.target.value;
                          if (!userId) return;
                          
                          const confirm = await Swal.fire({
                            title: "¿Cambiar rol?",
                            text: `¿Estás seguro de cambiar el rol de ${displayName} a ${newRole.toUpperCase()}?`,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#2dbda1",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Sí, cambiar",
                            cancelButtonText: "Cancelar",
                          });

                          if (confirm.isConfirmed) {
                            try {
                              await updateProfile(userId, { role: newRole as UserRole });
                              Swal.fire({
                                title: "¡Rol actualizado!",
                                text: `El rol de ${displayName} ahora es ${newRole.toUpperCase()}.`,
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                            } catch (err) {
                              console.error(err);
                              Swal.fire({
                                title: "Error",
                                text: "No se pudo actualizar el rol.",
                                icon: "error",
                                confirmButtonColor: "#d33",
                              });
                            }
                          }
                        }}
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          background: "#ffffff",
                          border: "1.5px solid #dcdcdc",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          color: "#4a4a4a",
                          outline: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                          display: "inline-flex",
                          alignItems: "center",
                          appearance: "none",
                          WebkitAppearance: "none",
                          paddingRight: "24px",
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232dbda1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 8px center",
                          backgroundSize: "12px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2dbda1";
                          e.currentTarget.style.boxShadow = "0 4px 10px rgba(45, 189, 161, 0.15)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#dcdcdc";
                          e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.05)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2dbda1";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45, 189, 161, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#dcdcdc";
                          e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.05)";
                        }}
                      >
                        <option value="normal">NORMAL</option>
                        <option value="vigilant">VIGILANT</option>
                        <option value="admin" disabled={i.role !== "admin"}>ADMIN</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          background: "#f0f2f5",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          color: "#6e6e73",
                        }}
                      >
                        ROLE: {i.role?.toUpperCase() || "NORMAL"}
                      </span>
                    )}

                    {isAdmin && (
                      <div className="ddg-card-actions">
                        <button
                          type="button"
                          className="ddg-btn-icon ddg-btn-delete"
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
                          title="Eliminar Usuario"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "40px", color: "#8c92ac" }}>
            No hay usuarios registrados en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}