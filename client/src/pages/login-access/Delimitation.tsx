import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FiMap, FiShield, FiInfo, FiAlertCircle, FiSettings, FiRotateCcw, FiSave } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import MapViewer from "../../components/ui/MapViewer";
import { getDelimitationData, saveDelimitationData, DEFAULT_DELIMITATION, DelimitationData } from "../../utils/delimitationStore";
import "./Delimitation.css";

export default function Delimitation() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [delim, setDelim] = useState<DelimitationData>(getDelimitationData());
  const [formData, setFormData] = useState<DelimitationData>(getDelimitationData());

  useEffect(() => {
    const handleUpdate = () => {
      const data = getDelimitationData();
      setDelim(data);
      setFormData(data);
    };
    window.addEventListener("delimitation_updated", handleUpdate);
    return () => window.removeEventListener("delimitation_updated", handleUpdate);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "radius" || name === "lat" || name === "lng" ? Number(value) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(formData.lat) || isNaN(formData.lng) || isNaN(formData.radius)) {
      Swal.fire({
        icon: "error",
        title: "Datos inválidos",
        text: "La latitud, longitud y el radio deben ser valores numéricos válidos.",
        confirmButtonColor: "#142B36",
      });
      return;
    }

    if (formData.radius <= 0) {
      Swal.fire({
        icon: "error",
        title: "Radio inválido",
        text: "El radio del perímetro debe ser mayor a 0 metros.",
        confirmButtonColor: "#142B36",
      });
      return;
    }

    saveDelimitationData(formData);

    Swal.fire({
      icon: "success",
      title: "Configuración guardada",
      text: "Los límites geográficos y reglas de la colonia han sido actualizados con éxito.",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  const handleRestoreDefaults = () => {
    Swal.fire({
      title: "¿Restablecer valores?",
      text: "Esto restaurará la configuración geográfica inicial de la Colonia Vista Hermosa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2dbda1",
      cancelButtonColor: "#e54a55",
      confirmButtonText: "Sí, restablecer",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        saveDelimitationData(DEFAULT_DELIMITATION);
        Swal.fire({
          icon: "success",
          title: "Restablecido",
          text: "Configuración restablecida a los valores predeterminados.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="ddg-dash-wrapper">
      <div className="ddg-dash-bg-yellow" aria-hidden="true" />
      <div className="ddg-dash-bg-red" aria-hidden="true" />

      <div className="ddg-dash-content" style={{ width: "100%" }}>
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Zonas y Delimitación Territorial</h1>
          <p className="ddg-dash-subtitle">
            Visualiza y gestiona las áreas de cobertura de seguridad y geocercas activas.
          </p>
        </div>

        {/* Main grid */}
        <div
          className="delim-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isAdmin ? "1fr 1fr" : "1.2fr 1fr",
            gap: "24px",
            width: "100%",
            maxWidth: "1160px",
            marginBottom: "32px",
          }}
        >
          {/* Column 1: Info Panel */}
          <div className="delim-info-card">
            <div className="delim-banner">
              <FiMap className="delim-banner-icon" />
              <div>
                <h3>Sector Oficial: Vista Hermosa</h3>
                <p>Ubicación Central: {delim.lat.toFixed(4)}, {delim.lng.toFixed(4)} • Radio: {delim.radius}m</p>
              </div>
            </div>

            <div className="delim-desc-box">
              {delim.description}
            </div>

            <div className="delim-rules-list">
              <div className="delim-rule-item">
                <div className="delim-rule-icon-wrapper">
                  <FiShield />
                </div>
                <div>
                  <h4>Perímetro de Seguridad</h4>
                  <p>{delim.securityPerimeter}</p>
                </div>
              </div>

              <div className="delim-rule-item">
                <div className="delim-rule-icon-wrapper">
                  <FiInfo />
                </div>
                <div>
                  <h4>Accesos y Control</h4>
                  <p>{delim.accessPoints}</p>
                </div>
              </div>

              <div className="delim-rule-item">
                <div className="delim-rule-icon-wrapper">
                  <FiAlertCircle />
                </div>
                <div>
                  <h4>Políticas de Convivencia</h4>
                  <p>{delim.policies}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Map Viewer */}
          <div className="delim-map-container-card">
            <h3 className="delim-card-title">Mapa de Cobertura Activo</h3>
            <div style={{ flex: 1, minHeight: "350px", position: "relative" }}>
              <MapViewer />
            </div>
          </div>
        </div>

        {/* Admin: editable form — Non-admin: read-only data panel */}
        {isAdmin ? (
          <div className="delim-admin-card" style={{ maxWidth: "1160px", width: "100%" }}>
            <div className="delim-admin-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FiSettings className="delim-settings-icon" />
                <h3>Panel de Control de Delimitación</h3>
              </div>
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="delim-btn-secondary"
              >
                <FiRotateCcw /> Restablecer Valores
              </button>
            </div>

            <form onSubmit={handleSave} className="delim-form">
              <div className="delim-form-row">
                <div className="delim-form-group">
                  <label htmlFor="lat">Latitud Central</label>
                  <input type="number" id="lat" name="lat" step="0.000001"
                    value={formData.lat} onChange={handleChange} required />
                </div>
                <div className="delim-form-group">
                  <label htmlFor="lng">Longitud Central</label>
                  <input type="number" id="lng" name="lng" step="0.000001"
                    value={formData.lng} onChange={handleChange} required />
                </div>
                <div className="delim-form-group">
                  <label htmlFor="radius">Radio del Perímetro (Metros)</label>
                  <input type="number" id="radius" name="radius" min="50" max="5000"
                    value={formData.radius} onChange={handleChange} required />
                </div>
              </div>

              <div className="delim-form-group full-width">
                <label htmlFor="description">Descripción General del Sector</label>
                <textarea id="description" name="description" rows={2}
                  value={formData.description} onChange={handleChange} required />
              </div>

              <div className="delim-form-group full-width">
                <label htmlFor="securityPerimeter">Descripción del Perímetro de Seguridad</label>
                <textarea id="securityPerimeter" name="securityPerimeter" rows={2}
                  value={formData.securityPerimeter} onChange={handleChange} required />
              </div>

              <div className="delim-form-group full-width">
                <label htmlFor="accessPoints">Descripción de Casetas / Puntos de Acceso</label>
                <textarea id="accessPoints" name="accessPoints" rows={2}
                  value={formData.accessPoints} onChange={handleChange} required />
              </div>

              <div className="delim-form-group full-width">
                <label htmlFor="policies">Normas y Políticas de Convivencia</label>
                <textarea id="policies" name="policies" rows={2}
                  value={formData.policies} onChange={handleChange} required />
              </div>

              <div className="delim-form-actions">
                <button type="submit" className="delim-btn-primary">
                  <FiSave /> Guardar Cambios de Zona
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ── Read-only detail panel for vigilant & normal users ── */
          <div className="delim-admin-card delim-readonly-card" style={{ maxWidth: "1160px", width: "100%" }}>
            <div className="delim-admin-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FiSettings className="delim-settings-icon" style={{ opacity: 0.4 }} />
                <h3 style={{ color: "#142B36" }}>Parámetros de la Delimitación</h3>
              </div>
              {/* Read-only badge */}
              <span className="delim-readonly-badge">
                🔒 Solo lectura
              </span>
            </div>

            <div className="delim-form delim-readonly-form">
              <div className="delim-form-row">
                <div className="delim-form-group">
                  <label>Latitud Central</label>
                  <div className="delim-readonly-field">{delim.lat.toFixed(6)}</div>
                </div>
                <div className="delim-form-group">
                  <label>Longitud Central</label>
                  <div className="delim-readonly-field">{delim.lng.toFixed(6)}</div>
                </div>
                <div className="delim-form-group">
                  <label>Radio del Perímetro</label>
                  <div className="delim-readonly-field">{delim.radius} m</div>
                </div>
              </div>

              <div className="delim-form-group full-width">
                <label>Descripción General del Sector</label>
                <div className="delim-readonly-field delim-readonly-multiline">{delim.description}</div>
              </div>

              <div className="delim-form-group full-width">
                <label>Perímetro de Seguridad</label>
                <div className="delim-readonly-field delim-readonly-multiline">{delim.securityPerimeter}</div>
              </div>

              <div className="delim-form-group full-width">
                <label>Casetas / Puntos de Acceso</label>
                <div className="delim-readonly-field delim-readonly-multiline">{delim.accessPoints}</div>
              </div>

              <div className="delim-form-group full-width">
                <label>Normas y Políticas de Convivencia</label>
                <div className="delim-readonly-field delim-readonly-multiline">{delim.policies}</div>
              </div>

              <p className="delim-readonly-note">
                Esta información es gestionada exclusivamente por el administrador de la comunidad.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
