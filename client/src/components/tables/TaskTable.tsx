import { useState } from "react";
import { useNavigate } from "react-router";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";

import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteTaskForm from "../forms/UpdateTaskForm";
import { useTask } from "../../context/TaskContext";

interface TaskItem {
  _id: string;
  title2: string;
  description2: string;
  date2: string;
  user: string;
  image: string;
}

interface TaskTableProps {
  tasks: TaskItem[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

/**
 * TaskTable
 * - Muestra todos los anuncios (tasks)
 * - Permite editarlos y eliminarlos (solo admin)
 * - Abre un popup con formulario al editar
 * - Pide confirmación al eliminar mediante SweetAlert2
 */
export default function TaskTable({
  tasks,
}: TaskTableProps) {
  // deleteTask2 viene del contexto de tareas
  const { deleteTask2 } = useTask();

  // Estado para guardar la tarea que se está editando
  const [editing, editTask] =
    useState<TaskItem | null>(null);

  // Cierra popup limpiando el estado
  const closePopup = (): void => editTask(null);

  // Para redirigir luego de eliminar
  const navigate = useNavigate();

  // Columnas usadas por TableView
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
              Publicados:{" "}
              {new Date(i.date2).toLocaleDateString()}
            </p>

            <p className="text-[1rem] text-light-gray">
              ID usuario: {i.user}
            </p>

            <img
              src={i.image}
              alt="Task Image"
            />

            <span className="flex flex-row gap-16 justify-evenly">
              <button
                className="bg-custom-red text-white py-11 px-16 rounded-[8px]
                cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                hover:bg-dark-red"
                onClick={async () => {
                  const confirm = await Swal.fire({
                    title: "¿Eliminar anuncio?",
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
                      await deleteTask2(i._id);

                      await Swal.fire({
                        title: "Eliminado",
                        text: "El anuncio se ha eliminado correctamente.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                      });

                      await new Promise((resolve) =>
                        setTimeout(resolve, 500)
                      );

                      navigate("/admin");
                    } catch (err) {
                      console.error(err);

                      Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error al eliminar el anuncio.",
                        icon: "error",
                        confirmButtonColor: "#d33",
                      });
                    }
                  }
                }}
              >
                <MdDelete />
              </button>

              <button
                className="bg-custom-blue text-white py-11 px-16 rounded-[8px]
                cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                hover:bg-dark-blue"
                onClick={() => {
                  editTask(i);
                }}
              >
                <MdModeEdit />
              </button>
            </span>
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
        overlayClassName="bg-black/50"
        contentClassName="max-h-[95vh] overflow-auto"
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