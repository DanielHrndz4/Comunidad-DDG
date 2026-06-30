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

const ACCENT_CLASSES = [
  { name: "emerald", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  { name: "violet", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  { name: "blue", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  { name: "amber", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  { name: "red", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
];

export default function TaskTableUserNormal({ tasks }: TaskTableUserNormalProps) {
  const [editing, editTask] = useState<TaskItem | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const closePopup = (): void => editTask(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-5 gap-4 bg-slate-950 border border-dashed border-slate-700 rounded-2xl">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <p className="text-slate-500 text-sm m-0">No hay anuncios publicados aún.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((item, idx) => {
          const accent = ACCENT_CLASSES[idx % ACCENT_CLASSES.length];
          return (
            <article
              key={item._id}
              className={`bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50`}
            >
              {/* Barra de acento superior */}
              <div className={`h-0.5 bg-gradient-to-r from-${accent.name}-500 to-transparent`} />

              {/* Imagen */}
              {item.image && (
                <div
                  className="w-full h-40 overflow-hidden relative cursor-zoom-in group"
                  onClick={() => setLightboxSrc(item.image)}
                  title="Clic para ampliar"
                >
                  <img
                    src={item.image}
                    alt={item.title2}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  {/* Ícono de zoom */}
                  <div className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-md p-1.5 flex items-center justify-center transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              )}

              {/* Cuerpo */}
              <div className="px-5 pt-5 pb-0 flex flex-col gap-2.5 flex-grow">
                {/* Chip de categoría */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${accent.bg} ${accent.text} ${accent.border}`}>
                    Anuncio
                  </span>
                </div>

                <h3 className="text-white text-sm font-bold leading-snug tracking-tight line-clamp-2">
                  {item.title2}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {item.description2}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 mt-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-slate-500 text-xs">
                    {new Date(item.date2).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold ${accent.bg} ${accent.text} ${accent.border}`}>
                    {item.user?.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-slate-500">#{item.user?.slice(0, 6)}</span>
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
        overlayClassName="bg-black/70 backdrop-blur-sm"
        contentClassName="!bg-transparent !border-none !p-0 w-full max-w-[600px] max-h-[95vh] overflow-auto"
      >
        {editing && <UpadteTaskForm task={editing} close={closePopup} />}
      </Popup>
    </>
  );
}