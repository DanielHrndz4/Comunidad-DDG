import { useState } from "react";
import Popup from "reactjs-popup";
import UpadteTaskForm from "../forms/UpdateTaskForm";
import { ImageLightbox } from "../ui/ImageLightbox";

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

const ACCENT_COLORS = [
  { bg: "rgba(62,207,142,0.08)",  text: "#3ecf8e", border: "rgba(62,207,142,0.2)" },
  { bg: "rgba(139,92,246,0.08)",  text: "#8b5cf6", border: "rgba(139,92,246,0.2)" },
  { bg: "rgba(59,130,246,0.08)",  text: "#3b82f6", border: "rgba(59,130,246,0.2)" },
  { bg: "rgba(251,191,36,0.08)",  text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  { bg: "rgba(239,68,68,0.08)",   text: "#ef4444", border: "rgba(239,68,68,0.2)"  },
];

export default function TaskTableUserNormal({ tasks }: TaskTableUserNormalProps) {
  const [editing, editTask] = useState<TaskItem | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const closePopup = (): void => editTask(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{
        width: "100%", maxWidth: "1000px", margin: "0 auto",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 20px", gap: "16px",
        background: "#111111", border: "1px dashed #2e2e2e", borderRadius: "16px"
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3e3e3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <p style={{ color: "#555", fontSize: "15px", margin: 0 }}>No hay anuncios publicados aún.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        width: "100%", maxWidth: "1000px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px"
      }}>
        {tasks.map((item, idx) => {
          const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          return (
            <article
              key={item._id}
              style={{
                background: "#111111", border: "1px solid #1f1f1f",
                borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4)`;
                e.currentTarget.style.borderColor = accent.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#1f1f1f";
              }}
            >
              {/* Barra de acento superior */}
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent.text} 0%, transparent 100%)` }} />

              {/* Imagen */}
              {item.image && (
                <div
                  style={{ width: "100%", height: "160px", overflow: "hidden", position: "relative", cursor: "zoom-in" }}
                  onClick={() => setLightboxSrc(item.image)}
                  title="Clic para ampliar"
                >
                  <img
                    src={item.image}
                    alt={item.title2}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #111111 0%, transparent 60%)"
                  }} />
                  {/* Ícono de zoom */}
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "5px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ededed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              )}

              {/* Cuerpo */}
              <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
                {/* Chip de categoría */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px",
                    padding: "3px 10px", borderRadius: "20px",
                    background: accent.bg, color: accent.text, border: `1px solid ${accent.border}`
                  }}>
                    Anuncio
                  </span>
                </div>

                <h3 style={{
                  color: "#ededed", fontSize: "16px", fontWeight: "700", margin: 0,
                  lineHeight: "1.4", letterSpacing: "-0.2px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {item.title2}
                </h3>
                <p style={{
                  color: "#8b8b8b", fontSize: "14px", lineHeight: "1.6", margin: 0,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {item.description2}
                </p>
              </div>

              {/* Footer */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px", marginTop: "16px",
                borderTop: "1px solid #1a1a1a", background: "rgba(255,255,255,0.01)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{ color: "#555", fontSize: "12px" }}>
                    {new Date(item.date2).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%", background: accent.bg,
                    border: `1px solid ${accent.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: "700", color: accent.text
                  }}>
                    {item.user?.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ color: "#555", fontSize: "12px" }}>#{item.user?.slice(0, 6)}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} alt="Anuncio" onClose={() => setLightboxSrc(null)} />
      )}

      <Popup
        open={editing !== null}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        contentStyle={{ background: "transparent", border: "none", padding: 0, width: "100%", maxWidth: "600px", maxHeight: "95vh", overflow: "auto" }}
      >
        {editing && <UpadteTaskForm task={editing} close={closePopup} />}
      </Popup>
    </>
  );
}