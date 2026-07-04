import { useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";

import assets from "../../assets";
import PayVigilanceForm from "../../components/forms/PayVigilanceForm";
import { useAuth } from "../../context/AuthContext";
import "../login-access/LoginAccess.css";

interface MenuCardItem {
  text: string;
  description: string;
  cta: string;
  image: string;
  theme: string;
  number: string;
  callback: () => void;
}

export default function AdminHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paying, openPay] = useState<boolean>(false);
  const closePopup = (): void => openPay(false);

  const menuCards: MenuCardItem[] = [
    {
      text: "Reportes",
      description: "Revisa y gestiona los reportes e incidencias vecinales",
      cta: "Gestionar reportes",
      image: assets.formularioDeLlenado,
      theme: "card-teal",
      number: "01",
      callback: () => navigate("/admin/reports"),
    },
    {
      text: "Anuncios",
      description: "Publica y edita los avisos oficiales de la comunidad",
      cta: "Gestionar anuncios",
      image: assets.nota,
      theme: "card-indigo",
      number: "02",
      callback: () => navigate("/admin/tasks"),
    },
    {
      text: "Gestión de Pagos",
      description: "Registra y controla los pagos mensuales de seguridad",
      cta: "Gestionar pagos",
      image: assets.dinero,
      theme: "card-amber",
      number: "03",
      callback: () => navigate("/admin/payments"),
    },
    {
      text: "Gestión de Usuarios",
      description: "Administra los accesos y roles de los miembros",
      cta: "Ver usuarios",
      image: assets.tarjetaDeIdentificacion,
      theme: "card-rose",
      number: "04",
      callback: () => navigate("/admin/users"),
    },
    {
      text: "Gestión de Delimitación",
      description: "Edita el perímetro geográfico y reglas de la comunidad",
      cta: "Gestionar límites",
      image: assets.falcon,
      theme: "card-teal",
      number: "05",
      callback: () => navigate("/admin/delimitation"),
    },
    {
      text: "Mi Perfil",
      description: "Actualiza tu información personal y credenciales",
      cta: "Ver perfil",
      image: assets.usuario1,
      theme: "card-slate",
      number: "06",
      callback: () => navigate("/admin/profile"),
    },
  ];

  const firstName = user?.name?.split(" ")[0] || user?.username || "Administrador";

  return (
    <div className="ddg-dash-wrapper">
      {/* Decorative background shapes */}
      <div className="ddg-dash-bg-yellow" aria-hidden="true" />
      <div className="ddg-dash-bg-red" aria-hidden="true" />

      <div className="ddg-dash-content" style={{ width: "100%" }}>
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Panel de Administración</p>
          <h1 className="ddg-dash-title">¡Bienvenido, {firstName}!</h1>
          <p className="ddg-dash-subtitle">
            Gestiona la seguridad, reportes, pagos y miembros de la comunidad.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className="ddg-dash-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            width: "100%",
            maxWidth: "1160px",
          }}
        >
          {menuCards.map((card, index) => (
            <div
              key={index}
              className={`ddg-dash-card ${card.theme}`}
              onClick={card.callback}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && card.callback()}
              aria-label={card.text}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(20,43,54,0.08)",
                border: "1.5px solid rgba(20,43,54,0.06)",
                cursor: "pointer",
              }}
            >
              {/* Left colored stripe with icon */}
              <div
                className="ddg-dash-card-stripe"
                style={{ width: "30%", minWidth: "110px", maxWidth: "160px", flexShrink: 0 }}
              >
                <img src={card.image} alt={card.text} />
              </div>

              {/* Right body */}
              <div
                className="ddg-dash-card-body"
                style={{
                  flex: "1 1 auto",
                  minWidth: 0,
                  overflow: "hidden",
                  padding: "20px 22px",
                  background: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div className="ddg-dash-card-top">
                  <span className="ddg-dash-card-number">{card.number}</span>
                  <p className="ddg-dash-card-label">{card.text}</p>
                  <p className="ddg-dash-card-desc">{card.description}</p>
                </div>

                <div className="ddg-dash-card-footer">
                  <span className="ddg-dash-card-cta">{card.cta}</span>
                  <div className="ddg-dash-card-arrow">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Popup
        open={paying}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
        }}
        contentStyle={{
          maxHeight: "95%",
          overflow: "auto",
        }}
      >
        <PayVigilanceForm close={closePopup} />
      </Popup>
    </div>
  );
}