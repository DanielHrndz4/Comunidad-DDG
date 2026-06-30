import { useState } from "react";
import { useNavigate } from "react-router";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";

import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteReportForm from "../forms/UpdateReportForm";
import { useTask } from "../../context/TaskContext";

interface ReportItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  user: string;
  image: string;
}

interface ReportTableProps {
  reports: ReportItem[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

/**
 * ReportTable
 * - Muestra una tabla/listado de reportes recibidos por prop `reports`.
 * - Permite eliminar o editar cada reporte.
 * - Usa TaskContext para acciones (deleteTask) y react-router para navegación.
 */
export default function ReportTable({
  reports,
}: ReportTableProps) {
  // Acción del contexto para eliminar tareas/reportes
  const { deleteTask } = useTask();

  // Estado local para el reporte que está en edición
  const [editing, editReport] =
    useState<ReportItem | null>(null);

  // Función para cerrar el popup de edición
  const closePopup = (): void => editReport(null);

  // Hook para redirigir tras acciones
  const navigate = useNavigate();

  // Definición de campos y anchos para TableView
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
        {reports.length > 0 &&
          reports.map((i) => (
            <TableCard key={i._id}>
              <h2 className="text-[1.5rem] text-dark-gray font-bold">
                {i.title}
              </h2>

              <p className="text-[1rem] text-light-gray">
                {i.description}
              </p>

              <p className="text-[1rem] text-light-gray">
                Publicado:{" "}
                {new Date(i.date).toLocaleDateString()}
              </p>

              <p className="text-[1rem] text-light-gray">
                ID usuario: {i.user}
              </p>

              <img
                src={i.image}
                alt="Report Image"
              />

              <span className="flex flex-row gap-16 justify-evenly">
                <button
                  className="bg-custom-red text-white py-11 px-16 rounded-[8px]
                  cursor-pointer text-[1rem] font-bold gap-8 duration-300 ease-in-out mt-16
                  hover:bg-dark-red"
                  onClick={async () => {
                    const confirm = await Swal.fire({
                      title: "¿Eliminar publicación?",
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
                        await deleteTask(i._id);

                        await Swal.fire({
                          title: "Eliminado",
                          text: "La publicación se ha eliminado correctamente.",
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
                          text: "Ocurrió un error al eliminar la publicación.",
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
                    editReport(i);
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
          <UpadteReportForm
            report={editing}
            close={closePopup}
          />
        )}
      </Popup>
    </>
  );
}