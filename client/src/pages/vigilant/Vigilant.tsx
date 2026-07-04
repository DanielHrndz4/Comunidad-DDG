import { useNavigate } from "react-router";
import assets from "../../assets";
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

function Vigilant() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuCards: MenuCardItem[] = [
    {
      text: "Registro de Visitas",
      description: "Controla y registra la entrada y salida de visitantes",
      cta: "Ir a visitas",
      image: assets.tarjetaDeIdentificacion,
      theme: "card-teal",
      number: "01",
      callback: () => navigate("/visits"),
    },
    {
      text: "Horarios",
      description: "Visualiza tus turnos y horarios asignados",
      cta: "Ver horarios",
      image: assets.calendario,
      theme: "card-indigo",
      number: "02",
      callback: () => navigate("/schedules"),
    },
    {
      text: "Delimitación de Zona",
      description: "Consulta el perímetro geográfico y reglas de la comunidad",
      cta: "Ver límites",
      image: assets.falcon,
      theme: "card-teal",
      number: "03",
      callback: () => navigate("/delimitation"),
    },
    {
      text: "Mi Perfil",
      description: "Administra tu información personal y de contacto",
      cta: "Ver perfil",
      image: assets.usuario1,
      theme: "card-slate",
      number: "04",
      callback: () => navigate("/profileVigilant"),
    },
  ];

  const firstName = user?.name?.split(" ")[0] || user?.username || "Vigilante";

  return (
    <div className="ddg-dash-wrapper">
      {/* Decorative background shapes */}
      <div className="ddg-dash-bg-yellow" aria-hidden="true" />
      <div className="ddg-dash-bg-red" aria-hidden="true" />

      <div className="ddg-dash-content" style={{ width: "100%" }}>
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG • Vigilancia</p>
          <h1 className="ddg-dash-title">¡Buen turno, {firstName}!</h1>
          <p className="ddg-dash-subtitle">
            Selecciona una herramienta para gestionar el control residencial.
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
    </div>
  );
}

export default Vigilant;
