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
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "A"
        };
      case "vigilant":
        return {
          homeUrl: "/vigilant",
          homeLabel: "Panel Vigilante",
          profileUrl: "/profileVigilant",
          roleLabel: "Vigilante",
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "V"
        };
      default:
        return {
          homeUrl: "/user",
          homeLabel: "Inicio",
          profileUrl: "/profile",
          roleLabel: "Usuario",
          initials: user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U"
        };
    }
  };

  const config = getNavConfig();

  return (
    <nav style={{ background: "#1c1c1c", borderBottom: "1px solid #2e2e2e", height: "64px" }} className="flex justify-between items-center px-8 w-full box-border sticky top-0 z-50">
      
      {/* ── Logo/Inicio ── */}
      <div className="flex items-center">
        <Link to={config.homeUrl} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3ecf8e 0%, #1a9e6e 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span style={{ color: "#ededed", fontSize: "16px", fontWeight: "600", letterSpacing: "-0.3px" }}>{config.homeLabel}</span>
        </Link>
      </div>

      <div className="flex items-center gap-16">
        
        {/* Mapa SIG exclusivo para Admin */}
        {role === "admin" && (
          <Link
            to="/admin/sig"
            style={{
              display: "flex", alignItems: "center", gap: "6px", textDecoration: "none",
              color: "#ededed", fontSize: "14px", fontWeight: "500", padding: "6px 12px",
              borderRadius: "6px", transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
            Mapa SIG
          </Link>
        )}

        {/* ── Perfil / Dropdown ── */}
        <Popup
          trigger={
            <button
              type="button"
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: "4px",
                display: "flex", alignItems: "center", gap: "10px"
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", background: "#2e2e2e",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#ededed", fontSize: "14px", fontWeight: "600",
                boxShadow: "0 0 0 2px #1c1c1c, 0 0 0 4px rgba(62,207,142,0.2)", transition: "all 0.2s"
              }}>
                {config.initials}
              </div>
            </button>
          }
          position="bottom right"
          closeOnDocumentClick
          arrow={false}
          offsetY={8}
          contentStyle={{ padding: 0, border: "none", background: "transparent", width: "auto", boxShadow: "none" }}
        >
          <div style={{
            background: "#141414", border: "1px solid #2e2e2e", borderRadius: "10px", padding: "8px",
            width: "220px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", gap: "4px"
          }}>
            
            {/* Cabecera del dropdown */}
            <div style={{ padding: "8px 12px", borderBottom: "1px solid #232323", marginBottom: "4px" }}>
              <div style={{ color: "#ededed", fontSize: "14px", fontWeight: "600" }}>{user?.name || config.roleLabel}</div>
              <div style={{ color: "#8b8b8b", fontSize: "12px" }}>{user?.email || config.roleLabel}</div>
            </div>

            {/* Ver Perfil */}
            <button
              onClick={() => navigate(config.profileUrl)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none",
                width: "100%", padding: "10px 12px", borderRadius: "6px", cursor: "pointer",
                color: "#d4d4d8", fontSize: "14px", transition: "all 0.15s", textAlign: "left"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1c1c1c"; e.currentTarget.style.color = "#ededed"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d4d4d8"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Ver perfil
            </button>

            {/* Cerrar sesión */}
            <button
              onClick={() => logout()}
              style={{
                display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none",
                width: "100%", padding: "10px 12px", borderRadius: "6px", cursor: "pointer",
                color: "#ef4444", fontSize: "14px", transition: "all 0.15s", textAlign: "left"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Cerrar sesión
            </button>

          </div>
        </Popup>
      </div>
    </nav>
  );
}