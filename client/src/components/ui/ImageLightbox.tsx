import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", cursor: "zoom-out",
        animation: "fadeIn 0.18s ease"
      }}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "20px", right: "24px",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "50%", width: "40px", height: "40px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ededed", cursor: "pointer", transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Imagen ampliada */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "85vh",
          objectFit: "contain", borderRadius: "12px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          cursor: "default",
          animation: "scaleIn 0.2s ease"
        }}
      />

      {/* Hint */}
      <p style={{
        position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0, userSelect: "none"
      }}>
        Clic en cualquier lugar para cerrar
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
