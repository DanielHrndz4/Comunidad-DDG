import { useEffect, useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import Popup from "reactjs-popup";

import ReportTable from "../../components/tables/ReportTable";
import CreateReportForm from "../../components/forms/CreateReportForm";
import { useTask } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import "./LoginAccess.css";

export default function ReportsView() {
  const { tasksAdmin, getTaskAdmin } = useTask();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"all" | "normal" | "danger">("all");

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => {
    setIsOpen(false);
    getTaskAdmin(); // refresh list after closing the form
  };

  useEffect(() => {
    getTaskAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredReports = (tasksAdmin || []).filter((task: any) => {
    if (filterType === "normal") return !task.isDangerZone;
    if (filterType === "danger") return task.isDangerZone;
    return true;
  });

  return (
    <div className="ddg-dash-wrapper">
      {/* Background Decorations */}
      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Page Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Reportes de la Comunidad</h1>
          <p className="ddg-dash-subtitle">
            {isAdmin
              ? `${tasksAdmin?.length ?? 0} reportes registrados — gestionados por el equipo administrativo`
              : "Consulta y crea reportes de tu comunidad"}
          </p>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={openPopup}
          style={{
            background: "#2dbda1",
            color: "#ffffff",
            border: "none",
            padding: "12px 28px",
            borderRadius: "30px",
            fontSize: "15px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(45,189,161,0.3)",
            transition: "all 0.25s ease",
            marginBottom: "32px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(45,189,161,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(45,189,161,0.3)";
          }}
        >
          <MdAddCircle size={20} />
          Nuevo Reporte
        </button>

        <Popup
          open={isOpen}
          onClose={closePopup}
          lockScroll={true}
          position="top center"
          closeOnDocumentClick={false}
          modal={true}
          overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
          contentStyle={{
            maxHeight: "95vh",
            overflow: "auto",
            maxWidth: "1050px",
            width: "95vw",
            borderRadius: "24px",
            padding: "0",
            border: "none",
            background: "transparent",
          }}
        >
          <CreateReportForm close={closePopup} />
        </Popup>

        {/* Filter Pills */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
          background: "rgba(20, 43, 54, 0.03)",
          padding: "6px",
          borderRadius: "14px",
          width: "fit-content",
          border: "1px solid rgba(20, 43, 54, 0.05)",
          flexWrap: "wrap"
        }}>
          <button
            type="button"
            onClick={() => setFilterType("all")}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: filterType === "all" ? "#142B36" : "transparent",
              color: filterType === "all" ? "#ffffff" : "#6E6E73",
              transition: "all 0.2s ease"
            }}
          >
            Todos ({tasksAdmin?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("normal")}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: filterType === "normal" ? "#2dbda1" : "transparent",
              color: filterType === "normal" ? "#ffffff" : "#6E6E73",
              transition: "all 0.2s ease"
            }}
          >
            Normales ({(tasksAdmin || []).filter(t => !t.isDangerZone).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("danger")}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: filterType === "danger" ? "#e54a55" : "transparent",
              color: filterType === "danger" ? "#ffffff" : "#6E6E73",
              transition: "all 0.2s ease"
            }}
          >
            ⚠️ Zonas de Riesgo ({(tasksAdmin || []).filter(t => t.isDangerZone).length})
          </button>
        </div>

        {/* Report Cards */}
        <ReportTable reports={filteredReports} />

        {/* Empty state */}
        {(!filteredReports || filteredReports.length === 0) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "60px 20px",
              color: "#8c92ac",
              textAlign: "center",
            }}
          >
            <HiDocumentReport size={64} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>
              {filterType === "all" 
                ? "No hay reportes publicados todavía" 
                : filterType === "normal" 
                ? "No hay reportes normales publicados" 
                : "No hay zonas de riesgo marcadas"}
            </p>
            <p style={{ fontSize: "14px", margin: 0 }}>
              {filterType === "all"
                ? "Sé el primero en reportar algo de tu comunidad"
                : "Intenta cambiar el filtro para ver otros reportes"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
