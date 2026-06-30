interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 cursor-zoom-out animate-fadeIn"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-[18px] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.7)] animate-scaleIn"
      />

      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
        Clic en cualquier lugar para cerrar
      </p>
    </div>
  );
}
