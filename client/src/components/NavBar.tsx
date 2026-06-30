import { Link, useNavigate } from "react-router";
import Popup from "reactjs-popup";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Determinar la ruta base según el rol
  const role = user?.role || "normal";
  
  const getNavConfig = () => {
    switch (role) {
      case "admin":
        return {
          homeUrl: "/admin",
          homeLabel: "Panel Admin",
          profileUrl: "/admin/profile",
          roleLabel: "Administrador",
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "A",
          gradient: "from-blue-500 to-blue-700",
          ring: "ring-blue-500/40"
        };
      case "vigilant":
        return {
          homeUrl: "/vigilant",
          homeLabel: "Panel Vigilante",
          profileUrl: "/profileVigilant",
          roleLabel: "Vigilante",
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "V",
          gradient: "from-emerald-500 to-emerald-700",
          ring: "ring-emerald-500/40"
        };
      default:
        return {
          homeUrl: "/user",
          homeLabel: "Inicio",
          profileUrl: "/profile",
          roleLabel: "Usuario",
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U",
          gradient: "from-violet-500 to-violet-700",
          ring: "ring-violet-500/40"
        };
    }
  };

  const config = getNavConfig();

  return (
    <nav className="bg-neutral-900/90 border-b border-white/10 h-64 flex justify-between items-center px-32 w-full box-border sticky top-0 z-50 backdrop-blur-md">
      
      {/* ── Logo/Inicio ── */}
      <div className="flex items-center">
        <Link to={config.homeUrl} className="flex items-center gap-10 no-underline">
          <div className={`w-32 h-32 bg-gradient-to-br ${config.gradient} rounded-8 flex items-center justify-center shadow-md`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#030712" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="font-display text-neutral-100 text-16 font-semibold tracking-tight">{config.homeLabel}</span>
        </Link>
      </div>

      <div className="flex items-center gap-16">
        
        {/* Mapa SIG exclusivo para Admin */}
        {role === "admin" && (
          <Link
            to="/admin/sig"
            className="flex items-center gap-6 no-underline text-neutral-100 text-14 font-medium px-12 py-6 rounded-6 hover:bg-white/5 transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
            <span>Mapa SIG</span>
          </Link>
        )}

        {/* ── Perfil / Dropdown ── */}
        <Popup
          trigger={
            <button
              type="button"
              className="bg-transparent border-none cursor-pointer p-4 flex items-center gap-10 focus:outline-none"
            >
              <div className={`w-36 h-36 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-100 text-14 font-semibold border-2 border-neutral-900 ring-2 ${config.ring} shadow-md transition-all duration-200 hover:brightness-110`}>
                {config.initials}
              </div>
            </button>
          }
          position="bottom right"
          closeOnDocumentClick
          arrow={false}
          offsetY={8}
          overlayClassName="bg-black/50"
          contentClassName="!p-0 !border-none !bg-transparent !shadow-none w-auto"
        >
          <div className="bg-neutral-950 border border-neutral-800 rounded-[24px] p-8 w-[220px] shadow-2xl flex flex-col gap-4 backdrop-blur-md">
            
            {/* Cabecera del dropdown */}
            <div className="px-12 py-8 border-b border-neutral-900 mb-4">
              <div className="text-neutral-100 text-14 font-semibold">{user?.name || config.roleLabel}</div>
              <div className="text-neutral-500 text-12 font-medium truncate">{user?.email || config.roleLabel}</div>
            </div>

            {/* Ver Perfil */}
            <button
              onClick={() => navigate(config.profileUrl)}
              className="flex items-center gap-12 bg-transparent border-none w-full px-12 py-10 rounded-6 cursor-pointer text-neutral-300 text-14 text-left hover:bg-neutral-800 hover:text-white transition-colors duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Ver perfil</span>
            </button>

            {/* Cerrar sesión */}
            <button
              onClick={() => logout()}
              className="flex items-center gap-12 bg-transparent border-none w-full px-12 py-10 rounded-6 cursor-pointer text-red-500 text-14 text-left hover:bg-red-500/10 transition-colors duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar sesión</span>
            </button>

          </div>
        </Popup>
      </div>
    </nav>
  );
}