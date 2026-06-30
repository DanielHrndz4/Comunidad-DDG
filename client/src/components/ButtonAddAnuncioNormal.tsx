import { useNavigate } from "react-router";

interface ButtonAddAnuncioNormalProps {
  onClose: () => void;
}

export default function ButtonAddAnuncioNormal({
  onClose,
}: ButtonAddAnuncioNormalProps) {
  // Hook de React Router para navegar entre rutas
  const navigate = useNavigate();

  // Función que redirige a la ruta recibida como argumento
  function handleNavigation(route: string): void {
    navigate(route);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="card-panel w-full max-w-md mx-4 p-6">
        <div className="flex gap-2 justify-center mb-6">
          <div className="h-1 flex-1 bg-white/10 rounded-full" />
          <div className="h-1 flex-1 bg-white/10 rounded-full" />
        </div>

        <div className="flex justify-center mb-4">
          <button
            type="button"
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => {
              handleNavigation("/userAnuncios");
            }}
          >
            Agregar anuncio
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}