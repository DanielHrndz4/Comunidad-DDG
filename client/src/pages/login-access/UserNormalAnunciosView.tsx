import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

import TaskTableUserNormal from "../../components/tables/TaskTableUserNormal";
import CreateTaskFormUserNormal from "../../components/forms/CreateTaskFormUserNormal";
import { useTask } from "../../context/TaskContext";
import CreateButton from "../../components/CreateButton";

export default function UserNormalAnunciosView() {
  const { getTaskAdmin2, tasksAdmin2 } = useTask();

  const [isOpen, setIsOpen] =
    useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  useEffect(() => {
    getTaskAdmin2();
  }, [getTaskAdmin2]);

  return (
    <div className="flex grow flex-col justify-start items-center w-full min-h-screen bg-transparent p-10 box-border">
      
      {/* HEADER TIPO BENTO */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Anuncios de la Comunidad</h1>
          <p style={{ fontSize: "16px", color: "#9ca3af", margin: 0 }}>Mantente al tanto de las últimas novedades y avisos importantes.</p>
        </div>
        
        <button
          type="button"
          onClick={openPopup}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#3ecf8e", color: "#050505",
            padding: "12px 24px", borderRadius: "8px",
            fontSize: "15px", fontWeight: "600",
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(62,207,142,0.4)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(62,207,142,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(62,207,142,0.4)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Anuncio
        </button>
      </div>

      <Popup
        open={isOpen}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        contentStyle={{
          background: "transparent",
          border: "none",
          padding: 0,
          width: "100%",
          maxWidth: "600px",
          maxHeight: "95vh",
          overflow: "auto"
        }}
      >
        <CreateTaskFormUserNormal close={closePopup} />
      </Popup>

      <TaskTableUserNormal tasks={tasksAdmin2} />
    </div>
  );
}