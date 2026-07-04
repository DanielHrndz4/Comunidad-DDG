import { useEffect, useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { MdCampaign } from "react-icons/md";
import Popup from "reactjs-popup";

import TaskTable from "../../components/tables/TaskTable";
import CreateTaskForm from "../../components/forms/CreateTaskForm";
import { useTask } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import "./LoginAccess.css";

export default function AnunciosView() {
  const { tasksAdmin2, getTaskAdmin2 } = useTask();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  useEffect(() => {
    getTaskAdmin2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ddg-dash-wrapper">
      {/* Background Decorations */}
      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Page Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Anuncios Oficiales</h1>
          <p className="ddg-dash-subtitle">
            {isAdmin
              ? `${tasksAdmin2?.length ?? 0} anuncios publicados — administra los comunicados de tu comunidad`
              : "Mantente informado con los comunicados de la administración"}
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
          Nuevo Anuncio
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
          <CreateTaskForm close={closePopup} />
        </Popup>

        {/* Announcements Cards */}
        <TaskTable tasks={tasksAdmin2} />

        {/* Empty state */}
        {(!tasksAdmin2 || tasksAdmin2.length === 0) && (
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
            <MdCampaign size={64} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No hay anuncios publicados todavía
            </p>
            <p style={{ fontSize: "14px", margin: 0 }}>
              Los comunicados importantes de la administración aparecerán aquí
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
