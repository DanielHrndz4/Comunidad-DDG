import { useState } from "react";
import Popup from "reactjs-popup";
import { MdPerson, MdEdit, MdEmail, MdPhone, MdShield } from "react-icons/md";

import { useAuth } from "../../context/AuthContext";
import UpdateUserNormalForm from "../../components/forms/UpdateUserNormalForm";
import "./LoginAccess.css";

export default function Profile() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  if (!user) {
    return (
      <div className="ddg-dash-wrapper">
        <div className="ddg-dash-bg-yellow" />
        <div className="ddg-dash-bg-red" />
        <div className="ddg-dash-content">
          <p style={{ color: "#8c92ac", fontSize: "16px" }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const roleLabel = user.role === "admin" ? "Administrador" : user.role === "vigilant" ? "Vigilante" : "Vecino";
  const roleColor = user.role === "admin" ? "#e54a55" : user.role === "vigilant" ? "#fcc33a" : "#2dbda1";

  const fields = [
    { icon: <MdPerson size={18} />, label: "Nombre completo", value: user.name },
    { icon: <MdEmail size={18} />, label: "Correo electrónico", value: user.email },
    { icon: <MdPhone size={18} />, label: "Teléfono", value: user.telephone || "—" },
  ];

  return (
    <div className="ddg-dash-wrapper">
      <style>{`
        .prf-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 28px;
          width: 100%;
          max-width: 900px;
        }
        @media (max-width: 700px) {
          .prf-container { grid-template-columns: 1fr; }
        }
        .prf-avatar-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(20,43,54,.10);
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }
        .prf-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2dbda1, #1a9e86);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 8px 24px rgba(45,189,161,.35);
          flex-shrink: 0;
        }
        .prf-name {
          font-size: 20px;
          font-weight: 700;
          color: #142B36;
          margin: 0;
        }
        .prf-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
        }
        .prf-edit-btn {
          background: linear-gradient(135deg, #2dbda1, #1a9e86);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all .25s ease;
          box-shadow: 0 4px 14px rgba(45,189,161,.3);
          width: 100%;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
        }
        .prf-edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,189,161,.45);
        }
        .prf-info-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(20,43,54,.10);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .prf-info-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #2dbda1;
          margin: 0 0 16px 0;
        }
        .prf-field {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f2f5;
        }
        .prf-field:last-child { border-bottom: none; }
        .prf-field-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f0f9f7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2dbda1;
          flex-shrink: 0;
        }
        .prf-field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          color: #8c92ac;
          margin: 0 0 3px 0;
        }
        .prf-field-value {
          font-size: 15px;
          font-weight: 600;
          color: #142B36;
          margin: 0;
        }
      `}</style>

      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Mi Perfil</h1>
          <p className="ddg-dash-subtitle">Gestiona tu información personal de la comunidad</p>
        </div>

        <div className="prf-container">
          {/* Avatar Card */}
          <div className="prf-avatar-card">
            <div className="prf-avatar">{initials}</div>
            <h2 className="prf-name">{user.name}</h2>
            <span
              className="prf-role-badge"
              style={{ background: `${roleColor}20`, color: roleColor }}
            >
              <MdShield size={13} />
              {roleLabel}
            </span>

            <button className="prf-edit-btn" onClick={openPopup}>
              <MdEdit size={17} />
              Editar Perfil
            </button>

            <Popup
              open={isOpen}
              onClose={closePopup}
              lockScroll={true}
              position="top center"
              closeOnDocumentClick={false}
              modal={true}
              overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
              contentStyle={{ maxHeight: "95%", overflow: "auto", borderRadius: "20px", border: "none", padding: 0 }}
            >
              <UpdateUserNormalForm user={user} close={closePopup} />
            </Popup>
          </div>

          {/* Info Card */}
          <div className="prf-info-card">
            <p className="prf-info-title">Información Personal</p>
            {fields.map((f, i) => (
              <div className="prf-field" key={i}>
                <div className="prf-field-icon">{f.icon}</div>
                <div>
                  <p className="prf-field-label">{f.label}</p>
                  <p className="prf-field-value">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
