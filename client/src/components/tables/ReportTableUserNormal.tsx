import { useState } from "react";
import Popup from "reactjs-popup";

import TableCard from "./TableRow";
import TableView from "./TableView";
import UpadteReportForm from "../forms/UpdateReportForm";

interface ReportItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  user: string;
  image: string;
}

interface ReportTableUserNormalProps {
  reports: ReportItem[];
}

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

/**
 * ReportTableUserNormal
 * - Muestra los reportes para un usuario normal.
 * - Renderiza cada reporte con su título, descripción, fecha, usuario y la imagen.
 * - Mantiene la estructura del popup por consistencia.
 */
export default function ReportTableUserNormal({
  reports,
}: ReportTableUserNormalProps) {
  // Estado del reporte que podría editarse
  const [editing, editReport] =
    useState<ReportItem | null>(null);

  // Cierra el popup limpiando el estado
  const closePopup = (): void => editReport(null);

  // Definición de columnas y tamaños en TableView
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
        {reports?.map((i) => (
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
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
        }}
        contentStyle={{
          maxHeight: "95%",
          overflow: "auto",
        }}
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