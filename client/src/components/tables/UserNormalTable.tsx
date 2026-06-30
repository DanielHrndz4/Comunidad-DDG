// Imports removed: TableCard y TableView no se utilizan en este componente

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
      <div className="w-full max-w-4xl mx-auto mt-6 text-center p-10 bg-slate-900 border border-slate-700 rounded-lg">
        <p className="text-slate-400 m-0 text-sm">No hay datos de usuarios disponibles.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700">
            <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i) => {
            const userId = i._id ?? i.id ?? `${i.email}-${i.name}`;

            return (
              <tr 
                key={userId} 
                className="border-b border-slate-700 transition-colors duration-200 hover:bg-slate-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <span className="text-emerald-400 font-bold text-sm">
                        {i.name ? i.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{i.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">Activo en la comunidad</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-slate-300 text-sm">{i.email}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}