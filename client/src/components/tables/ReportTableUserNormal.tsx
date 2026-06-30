import { useState } from "react";
import Popup from "reactjs-popup";
import UpadteReportForm from "../forms/UpdateReportForm";
import { ImageLightbox } from "../ui/ImageLightbox";

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

function StatusBadge({ index }: { index: number }) {
  const statusMap = [
    { label: "Abierto", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
    { label: "En revisión", className: "bg-amber-500/10 text-amber-400 border-amber-500/25" },
    { label: "Cerrado", className: "bg-red-500/10 text-red-400 border-red-500/25" },
  ];
  
  const status = statusMap[index % 3];
  
  return (
    <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${status.className}`}>
      {status.label}
    </span>
  );
}

export default function ReportTableUserNormal({ reports }: ReportTableUserNormalProps) {
  const [editing, editReport] = useState<ReportItem | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const closePopup = (): void => editReport(null);

  if (!reports || reports.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-5 gap-4 bg-slate-950 border border-dashed border-slate-700 rounded-2xl">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p className="text-slate-500 text-sm m-0">No hay reportes registrados aún.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((item, idx) => (
          <article
            key={item._id}
            className="bg-slate-950 border border-slate-800 hover:border-emerald-500/20 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50 cursor-default"
          >
            {/* Imagen */}
            {item.image && (
              <div
                className="w-full h-40 overflow-hidden relative cursor-zoom-in group"
                onClick={() => setLightboxSrc(item.image)}
                title="Clic para ampliar"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                {/* Ícono de zoom */}
                <div className="absolute top-2 right-2 bg-black/50 rounded-md p-1.5 flex items-center justify-center group-hover:bg-black/70 transition-colors">
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
              <div className="flex items-start justify-between gap-2.5">
                <h3 className="text-white text-sm font-bold leading-snug tracking-tight flex-1">
                  {item.title}
                </h3>
                <StatusBadge index={idx} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {item.description}
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
                  {new Date(item.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-emerald-400">
                  {item.user?.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-slate-500">#{item.user?.slice(0, 6)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} alt="Reporte" onClose={() => setLightboxSrc(null)} />
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
        {editing && <UpadteReportForm report={editing} close={closePopup} />}
      </Popup>
    </>
  );
}