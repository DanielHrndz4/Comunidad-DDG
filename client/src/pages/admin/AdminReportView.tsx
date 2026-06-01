import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

import ReportTable from "../../components/tables/ReportTable";
import CreateReportForm from "../../components/forms/CreateReportForm";
import { useTask } from "../../context/TaskContext";
import CreateButton from "../../components/CreateButton";

export default function AdminReportView() {
  const { tasksAdmin, getTaskAdmin } = useTask();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  useEffect(() => {
    getTaskAdmin();
  }, [getTaskAdmin]);

  return (
    <div className="flex grow-1 flex-col justify-start items-center p-16 w-full h-content box-border">
      <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
        <h2
          style={{ color: "white" }}
          className="font-sans text-[1.75rem] font-bold text-white m-0 text-center"
        >
          Lista de reportes
        </h2>
      </div>

      <button type="button" onClick={openPopup}>
        <CreateButton text="Crear Reporte" />
      </button>

      <Popup
        open={isOpen}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{ maxHeight: "95%", overflow: "auto" }}
      >
        <CreateReportForm close={closePopup} />
      </Popup>

      <ReportTable reports={tasksAdmin} />
    </div>
  );
}