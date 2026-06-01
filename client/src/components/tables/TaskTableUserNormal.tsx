import { useState } from "react";
import Popup from "reactjs-popup";

import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteTaskForm from "../forms/UpdateTaskForm";

interface TaskItem {
  _id: string;
  title2: string;
  description2: string;
  date2: string;
  user: string;
  image: string;
}

interface TaskTableUserNormalProps {
  tasks: TaskItem[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

/**
 * TaskTableUserNormal
 * - Muestra los anuncios (tasks) visibles para un usuario normal.
 * - No permite editar ni eliminar.
 * - Renderiza una tabla con información de cada tarea.
 * - Mantiene el popup y estado de edición por consistencia.
 */
export default function TaskTableUserNormal({
  tasks,
}: TaskTableUserNormalProps) {
  // Estado que guarda la tarea que se está editando
  const [editing, editTask] =
    useState<TaskItem | null>(null);

  // Función para cerrar el popup
  const closePopup = (): void => editTask(null);

  // Definición de columnas de la tabla
  const fields: TableFields = {
    title: { width: 300 },
    desc: { width: 300 },
    date: { width: 300 },
    user: { width: 300 },
    image: { width: 300 },
    delete: { width: 50 },
  };

  return (
    <>
      <TableView fields={fields}>
        {tasks.map((i) => (
          <TableCard key={i._id}>
            <h2 className="text-[1.5rem] text-dark-gray font-bold">
              {i.title2}
            </h2>

            <p className="text-[1rem] text-light-gray">
              {i.description2}
            </p>

            <p className="text-[1rem] text-light-gray">
              Publicado:{" "}
              {new Date(i.date2).toLocaleDateString()}
            </p>

            <p className="text-[1rem] text-light-gray">
              ID usuario: {i.user}
            </p>

            <img
              src={i.image}
              alt="Task Image"
            />

            <span className="flex flex-row gap-16 justify-evenly" />
          </TableCard>
        ))}
      </TableView>

      <Popup
        open={editing !== null}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{ maxHeight: "95%", overflow: "auto" }}
      >
        {editing && (
          <UpadteTaskForm
            task={editing}
            close={closePopup}
          />
        )}
      </Popup>
    </>
  );
}