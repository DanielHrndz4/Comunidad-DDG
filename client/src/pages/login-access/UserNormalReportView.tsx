import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

import ReportTableUserNormal from "../../components/tables/ReportTableUserNormal";
import CreateReportFormUserNormal from "../../components/forms/CreateReportFormUserNormal";
import { useTask } from "../../context/TaskContext";

export default function UserNormalReportView() {
  const { getTaskAdmin, tasksAdmin } = useTask();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  useEffect(() => {
    getTaskAdmin();
  }, [getTaskAdmin]);

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1120px] space-y-8">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] sm:p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Reportes de la Comunidad</h1>
            <p className="mt-2 text-sm text-[#9ca3af]">Visualiza y crea reportes para mantener informada a tu comunidad.</p>
          </div>

          <button
            type="button"
            onClick={openPopup}
            className="inline-flex items-center gap-3 rounded-full bg-[#3ecf8e] px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
          >
            <span className="text-xl">+</span>
            Nuevo Reporte
          </button>
        </div>

        <Popup
          open={isOpen}
          onClose={closePopup}
          lockScroll={true}
          position="top center"
          closeOnDocumentClick={false}
          modal={true}
          overlayClassName="bg-black/70 backdrop-blur-sm"
          contentClassName="!bg-transparent !border-none !p-0 w-full max-w-[600px] max-h-[95vh] overflow-auto"
        >
          <CreateReportFormUserNormal close={closePopup} />
        </Popup>

        <ReportTableUserNormal reports={tasksAdmin} />
      </div>
    </div>
  );
}
