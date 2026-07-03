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
      <TableView fields={fields}>
        <TableCard>
          <p>No hay datos de usuarios (esperando un array).</p>
        </TableCard>
      </TableView>
    );
  }

  return (
    <TableView fields={fields}>
      {users.map((i) => (
        <TableCard
          key={i._id ?? i.id ?? `${i.email}-${i.name}`}
        >
          <h2 className="text-[1.5rem] text-dark-gray font-bold">
            {i.name}
          </h2>

          <p className="text-[1rem] text-light-gray font-bold">
            {i.email}
          </p>
        </TableCard>
      ))}
    </TableView>
  );
}