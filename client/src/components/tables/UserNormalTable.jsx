import TableCard from "./TableRow";
import TableView from "./TableView";

/**
 * UserNormalTable
 * - Muestra una tabla con usuarios normales.
 * - Solo despliega username y email; no permite editar ni eliminar.
 * - Recibe un array de usuarios mediante props.
 */
export default function UserNormalTable({ users = [] }) {

    // Definición de columnas y su ancho dentro de la tabla
    const fields = {
        username: { width: 300 },
        email: { width: 300 },
        delete: { width: 50 } // aunque no se usa (no hay botón), se mantiene por estructura
    };

    // Validación defensiva: si "users" no es un array, muestra un mensaje informativo
    if (!Array.isArray(users)) {
        return (
            <TableView fields={fields}>
                <TableCard>
                    <p>No hay datos de usuarios (esperando un array).</p>
                </TableCard>
            </TableView>
        );
    }

    // Render principal: muestra cada usuario en un TableCard
    return (
        <TableView fields={fields}>
            {users.map(i =>
                <TableCard 
                    key={i._id || i.id || Math.random()} // fallback para evitar errores de clave duplicada
                >
                    {/* Nombre de usuario */}
                    <h2 className="text-[1.5rem] text-dark-gray font-bold">{i.name}</h2>

                    {/* Correo electrónico */}
                    <p className="text-[1rem] text-light-gray font-bold">{i.email}</p>
                </TableCard>
            )}
        </TableView>
    );
}
