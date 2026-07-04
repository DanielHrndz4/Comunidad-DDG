import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Popup from "reactjs-popup";
import { FiMap, FiX, FiShield, FiInfo, FiAlertCircle } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import assets from "../assets";
import MapViewer from "./ui/MapViewer";
import { getDelimitationData } from "../utils/delimitationStore";
import "./AppNavBar.css";

interface AppNavBarProps {
  /** Role determines home route and profile route */
  role: "normal" | "vigilant" | "admin";
}

const ROLE_CONFIG = {
  normal: {
    homeRoute: "/user",
    profileRoute: "/profile",
    label: "Usuario",
  },
  vigilant: {
    homeRoute: "/vigilant",
    profileRoute: "/profileVigilant",
    label: "Vigilante",
  },
  admin: {
    homeRoute: "/admin",
    profileRoute: "/admin/profile",
    label: "Administrador",
  },
};

export default function AppNavBar({ role }: AppNavBarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showDelimitationModal, setShowDelimitationModal] = useState<boolean>(false);
  const [delim, setDelim] = useState(getDelimitationData());

  useEffect(() => {
    const handleUpdate = () => {
      setDelim(getDelimitationData());
    };
    window.addEventListener("delimitation_updated", handleUpdate);
    return () => window.removeEventListener("delimitation_updated", handleUpdate);
  }, []);
  
  const config = ROLE_CONFIG[role];
  const firstName = user?.name?.split(" ")[0] || user?.username || "Usuario";

  return (
    <nav
      className="app-navbar"
      style={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "64px",
        background: "#142B36",
        flexShrink: 0,
      }}
    >
      {/* Left — Logo + Brand */}
      <Link to={config.homeRoute} className="app-navbar-left">
        <img src={assets.falcon} alt="Comunidad DDG" className="app-navbar-logo" />
        <span className="app-navbar-brand">
          Comunidad <span>DDG</span>
        </span>
      </Link>

      {/* Center — Role badge only */}
      <span className="app-navbar-role">{config.label}</span>

      {/* Right — Avatar + dropdown */}
      <div className="app-navbar-right">
        <Popup
          trigger={
            <button type="button" className="app-navbar-avatar-btn">
              <img src={assets.usuario1} alt="Mi perfil" />
            </button>
          }
          position="bottom right"
          closeOnDocumentClick
          arrow={false}
          keepTooltipInside=".tooltipBoundary"
        >
          <div className="app-navbar-dropdown">
            {/* User info */}
            <div className="app-navbar-user-info">
              <p className="app-navbar-user-name">{firstName}</p>
              <p className="app-navbar-user-role">{config.label}</p>
            </div>

            {/* Profile */}
            <button
              className="app-navbar-dropdown-item"
              onClick={() => navigate(config.profileRoute)}
            >
              <img src={assets.girar} alt="" className="app-navbar-dropdown-icon" />
              Ver Perfil
            </button>

            <div className="app-navbar-divider" />

            {/* Logout */}
            <button
              className="app-navbar-dropdown-item danger"
              onClick={logout}
            >
              <img src={assets.cerrarSesion} alt="" className="app-navbar-dropdown-icon" />
              Cerrar sesión
            </button>
          </div>
        </Popup>
      </div>

      {/* Delimitation Information Modal */}
      {showDelimitationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(20, 43, 54, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "90%",
              maxWidth: "850px",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(20, 43, 54, 0.15)",
              border: "1.5px solid rgba(20, 43, 54, 0.05)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#142B36",
                padding: "20px 28px",
                color: "#ffffff",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                Límites y Zonas de Vista Hermosa
              </h3>
              <button
                type="button"
                onClick={() => setShowDelimitationModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
              >
                <FiX size={22} />
              </button>
            </div>

            <div
              style={{
                padding: "28px",
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "28px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              className="delim-modal-body"
            >
              {/* Left Column: Info card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div
                  style={{
                    background: "rgba(45, 189, 161, 0.06)",
                    padding: "16px",
                    borderRadius: "12px",
                    borderLeft: "4px solid #2dbda1",
                    fontSize: "13px",
                    color: "#1a8571",
                    lineHeight: "1.5",
                    fontWeight: 500,
                  }}
                >
                  {delim.description}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(20, 43, 54, 0.05)",
                        color: "#142B36",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiShield size={16} />
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#142B36" }}>
                        Perímetro de Seguridad
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: "1.4" }}>
                        {delim.securityPerimeter}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(20, 43, 54, 0.05)",
                        color: "#142B36",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiInfo size={16} />
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#142B36" }}>
                        Puntos de Acceso Vigilado
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: "1.4" }}>
                        {delim.accessPoints}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(20, 43, 54, 0.05)",
                        color: "#142B36",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiAlertCircle size={16} />
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: "#142B36" }}>
                        Políticas de Convivencia
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: "1.4" }}>
                        {delim.policies}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Read-only Map */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#142B36", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Mapa de la Zona Delimitada
                </span>
                <MapViewer />
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "16px 28px",
                display: "flex",
                justifyContent: "flex-end",
                borderTop: "1.5px solid rgba(20, 43, 54, 0.04)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowDelimitationModal(false)}
                style={{
                  background: "#142B36",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
