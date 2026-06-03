import TableCard from "./TableRow";
import TableView from "./TableView";

interface UserItem {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

interface UserNormalTableProps {
  users?: UserItem[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

/**
 * UserNormalTable
 * - Muestra una tabla con usuarios normales.
 * - Solo despliega nombre y email; no permite editar ni eliminar.
 * - Recibe un array de usuarios mediante props.
 */
export default function UserNormalTable({
  users = [],
}: UserNormalTableProps) {
  // Definición de columnas y su ancho dentro de la tabla
  const fields: TableFields = {
    username: { width: 300 },
    email: { width: 300 },
    delete: { width: 50 },
  };

  // Validación defensiva
  if (!Array.isArray(users)) {
    return (
      <div style={{ width: "100%", maxWidth: "1000px", margin: "24px auto 0", textAlign: "center", padding: "40px", backgroundColor: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "8px" }}>
        <p style={{ color: "#8b8b8b", margin: 0, fontSize: "14px" }}>No hay datos de usuarios disponibles.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "24px auto 0", overflowX: "auto", borderRadius: "8px", border: "1px solid #2e2e2e", backgroundColor: "#1c1c1c", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)" }}>
      <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#232323", borderBottom: "1px solid #2e2e2e" }}>
            <th style={{ padding: "12px 24px", fontSize: "12px", fontWeight: "600", color: "#8b8b8b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Usuario</th>
            <th style={{ padding: "12px 24px", fontSize: "12px", fontWeight: "600", color: "#8b8b8b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i) => {
            const userId = i._id ?? i.id ?? `${i.email}-${i.name}`;

            return (
              <tr 
                key={userId} 
                style={{ borderBottom: "1px solid #2e2e2e", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(62, 207, 142, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(62, 207, 142, 0.2)" }}>
                      <span style={{ color: "#3ecf8e", fontWeight: "bold", fontSize: "16px" }}>
                        {i.name ? i.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <div style={{ color: "#ededed", fontWeight: "500", fontSize: "14px" }}>{i.name}</div>
                      <div style={{ color: "#8b8b8b", fontSize: "12px", marginTop: "2px" }}>Activo en la comunidad</div>
                    </div>
                  </div>
                </td>
                
                <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                  <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{i.email}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}