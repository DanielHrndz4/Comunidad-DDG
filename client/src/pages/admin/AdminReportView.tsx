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
    <div className="flex grow-1 w-full flex-col items-center justify-start box-border px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto my-6 flex w-full max-w-[720px] items-center justify-center rounded-[24px] bg-[#0f172a] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.4)] sm:my-8 sm:p-6">
        <h2
          className="m-0 text-center font-sans text-2xl font-bold text-white sm:text-[1.75rem]"
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
        overlayClassName="bg-black/50"
        contentClassName="max-h-[95vh] overflow-auto"
      >
        <CreateReportForm close={closePopup} />
      </Popup>

      <ReportTable reports={tasksAdmin} />
    </div>
  );
}