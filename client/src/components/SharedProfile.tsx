import { useState } from "react";
import Popup from "reactjs-popup";
import {
  MdPerson, MdEdit, MdEmail, MdPhone,
  MdShield, MdCreditCard, MdAttachMoney, MdDescription,
  MdLock, MdCheckCircle, MdSecurity
} from "react-icons/md";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import UpdateUserNormalForm from "./forms/UpdateUserNormalForm";
import UpdateVigilantForm from "./forms/UpdateVigilantForm";
import UpdateAdminForm from "./forms/UpdateAdminForm";
import "../pages/login-access/LoginAccess.css";

interface PayFormData {
  numberTarget: string;
  context: string;
  amount: number;
  cvc: string;
}

const ROLE_META: Record<string, { label: string; color: string; description: string }> = {
  admin:    { label: "Administrador", color: "#e54a55",  description: "Administrador general de la organización" },
  vigilant: { label: "Vigilante",     color: "#fcc33a",  description: "Personal de seguridad comunitaria" },
  normal:   { label: "Vecino",        color: "#2dbda1",  description: "Miembro activo de la comunidad" },
};

const CSS = `
  .sp-outer { width:100%; max-width:1100px; display:flex; flex-direction:column; gap:24px; }

  /* Top row: avatar + info */
  .sp-top { display:grid; grid-template-columns:280px 1fr; gap:24px; }
  @media(max-width:700px){ .sp-top{ grid-template-columns:1fr; } }

  .sp-card { background:#fff; border-radius:20px; box-shadow:0 4px 24px rgba(20,43,54,.10); padding:28px 24px; }

  /* Avatar card */
  .sp-avatar { width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#2dbda1,#1a9e86);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#fff;box-shadow:0 8px 24px rgba(45,189,161,.35);margin:0 auto 14px; }
  .sp-name { font-size:19px;font-weight:700;color:#142B36;margin:0 0 8px;text-align:center; }
  .sp-badge { display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase; }
  .sp-desc { font-size:12px;color:#8c92ac;text-align:center;margin:10px 0 0; }
  .sp-edit-btn { background:linear-gradient(135deg,#2dbda1,#1a9e86);color:#fff;border:none;border-radius:12px;padding:11px 24px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .25s;box-shadow:0 4px 14px rgba(45,189,161,.3);width:100%;justify-content:center;font-family:'Montserrat',sans-serif;margin-top:18px; }
  .sp-edit-btn:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,189,161,.45); }

  /* Info card fields */
  .sp-sec-label { font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2dbda1;margin:0 0 14px; }
  .sp-fields-grid { display:grid;grid-template-columns:1fr 1fr;gap:0; }
  .sp-field { display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f0f2f5; }
  .sp-field:nth-child(odd) { padding-right:20px; }
  .sp-field-icon { width:36px;height:36px;border-radius:10px;background:#f0f9f7;display:flex;align-items:center;justify-content:center;color:#2dbda1;flex-shrink:0; }
  .sp-field-lbl { font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#8c92ac;margin:0 0 2px; }
  .sp-field-val { font-size:14px;font-weight:600;color:#142B36;margin:0; }

  /* Payment section — full width */
  .sp-pay-section { display:grid;grid-template-columns:1fr 380px;gap:28px;align-items:start; }
  @media(max-width:800px){ .sp-pay-section{ grid-template-columns:1fr; } }

  .sp-pay-label { font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#6e6e73;display:flex;align-items:center;gap:6px;margin-bottom:5px; }
  .sp-pay-label svg { color:#2dbda1; }
  .sp-pay-input { width:100%;padding:12px 16px;border:1.5px solid #e8e8ed;border-radius:12px;font-size:14px;font-family:'Montserrat',sans-serif;color:#142B36;background:#fafafa;transition:all .2s;box-sizing:border-box;outline:none; }
  .sp-pay-input:focus { border-color:#2dbda1;background:#fff;box-shadow:0 0 0 3px rgba(45,189,161,.12); }
  .sp-pay-input.err { border-color:#e54a55;background:#fff8f8; }
  .sp-pay-err { color:#e54a55;font-size:11px;font-weight:600;margin:4px 0 0; }
  .sp-pay-row { display:grid;grid-template-columns:1fr 140px;gap:14px; }
  .sp-pay-submit { background:linear-gradient(135deg,#2dbda1,#1a9e86);color:#fff;border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:700;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .25s;box-shadow:0 4px 14px rgba(45,189,161,.3);font-family:'Montserrat',sans-serif; }
  .sp-pay-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,189,161,.45); }
  .sp-pay-submit:disabled { opacity:.6;cursor:not-allowed; }

  /* Bank card visual */
  .sp-bank-card { background:linear-gradient(135deg,#142B36 0%,#1e4060 60%,#2a5a70 100%);border-radius:20px;padding:28px 26px;color:#fff;min-height:200px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 16px 48px rgba(20,43,54,.35);position:relative;overflow:hidden; }
  .sp-bank-card::before { content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:rgba(45,189,161,.12); }
  .sp-bank-card::after  { content:'';position:absolute;bottom:-80px;left:-40px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.04); }
  .sp-bank-logo { font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.7;position:relative;z-index:1; }
  .sp-bank-chip { width:42px;height:32px;background:linear-gradient(135deg,#fcc33a,#e8a800);border-radius:6px;position:relative;z-index:1;box-shadow:0 2px 8px rgba(0,0,0,.3); }
  .sp-bank-num { font-size:18px;font-weight:600;letter-spacing:3px;font-family:'Courier New',monospace;position:relative;z-index:1;text-shadow:0 1px 3px rgba(0,0,0,.3); }
  .sp-bank-footer { display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1; }
  .sp-bank-lbl { font-size:9px;opacity:.55;text-transform:uppercase;letter-spacing:1px;margin:0 0 3px; }
  .sp-bank-val { font-size:13px;font-weight:700;margin:0;letter-spacing:.5px; }

  /* Info bullets */
  .sp-info-bullets { display:flex;flex-direction:column;gap:10px;margin-top:20px; }
  .sp-bullet { display:flex;align-items:flex-start;gap:10px;font-size:12px;color:#6e6e73;line-height:1.5; }
  .sp-bullet svg { color:#2dbda1;flex-shrink:0;margin-top:1px; }

  /* Additional mobile optimizations */
  @media(max-width:600px){
    .sp-fields-grid { grid-template-columns: 1fr; }
    .sp-field { padding: 10px 0; }
    .sp-field:nth-child(odd) { padding-right: 0; }
    .sp-card { padding: 20px 16px; }
    .sp-avatar { width: 72px; height: 72px; font-size: 26px; }
    .sp-name { font-size: 17px; }
    .sp-bank-card { padding: 20px; min-height: 170px; }
    .sp-bank-num { font-size: 15px; letter-spacing: 2px; }
  }

`;

export default function SharedProfile() {
  const { user, addPay } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register, handleSubmit, setError, clearErrors, watch,
    formState: { errors, isSubmitting },
  } = useForm<PayFormData>();

  const cardNumber = watch("numberTarget") || "";
  const role = user?.role || "normal";
  const meta = ROLE_META[role] || ROLE_META.normal;
  const showPay = role === "normal";
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const EditForm = role === "admin" ? UpdateAdminForm : role === "vigilant" ? UpdateVigilantForm : UpdateUserNormalForm;

  const fields = [
    { icon: <MdPerson size={17} />,  label: "Nombre",   value: user?.name || "—" },
    { icon: <MdEmail size={17} />,   label: "Email",     value: user?.email || "—" },
    { icon: <MdPhone size={17} />,   label: "Teléfono",  value: user?.telephone || "—" },
  ];

  const validCard = (n: string) => {
    const c = n.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(c)) return false;
    let s = 0, alt = false;
    for (let i = c.length - 1; i >= 0; i--) {
      let d = parseInt(c[i], 10);
      if (alt) { d *= 2; if (d > 9) d -= 9; }
      s += d; alt = !alt;
    }
    return s % 10 === 0;
  };

  const genPDF = (data: PayFormData) => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(45, 189, 161);
    doc.text("Comunidad DDG", 20, 20);
    doc.setFontSize(16); doc.setTextColor(20, 43, 54);
    doc.text("Comprobante de Pago", 20, 32);
    doc.line(20, 37, 190, 37);
    doc.setFontSize(12); doc.setTextColor(100, 100, 100);
    doc.text(`Vecino: ${user?.name || "Usuario"}`, 20, 48);
    doc.text(`Tarjeta: **** **** **** ${data.numberTarget.replace(/\D/g, "").slice(-4)}`, 20, 58);
    doc.text(`Concepto: ${data.context}`, 20, 68);
    doc.text(`Monto: $${data.amount}.00`, 20, 78);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-SV")}`, 20, 88);
    doc.text(`ID Transacción: TXN-${Date.now()}`, 20, 98);
    doc.save(`Factura_${Date.now()}.pdf`);
  };

  const onSubmitPay = handleSubmit(async (values) => {
    if (!validCard(values.numberTarget)) {
      setError("numberTarget", { type: "manual", message: "Número de tarjeta inválido (verifica los dígitos)" }); return;
    } else clearErrors("numberTarget");
    if (!/^\d{3,4}$/.test(values.cvc)) {
      setError("cvc", { type: "manual", message: "CVC inválido (3 o 4 dígitos)" }); return;
    } else clearErrors("cvc");

    await addPay(values);
    genPDF(values);
    await Swal.fire({ title: "¡Pago exitoso!", text: "Tu comprobante PDF ha sido descargado.", icon: "success", confirmButtonColor: "#2dbda1" });
  });

  const formatCardDisplay = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const padded = digits.padEnd(16, "•");
    return `${padded.slice(0,4)} ${padded.slice(4,8)} ${padded.slice(8,12)} ${padded.slice(12,16)}`;
  };

  if (!user) {
    return (
      <div className="ddg-dash-wrapper">
        <div className="ddg-dash-bg-yellow" /><div className="ddg-dash-bg-red" />
        <div className="ddg-dash-content"><p style={{ color: "#8c92ac" }}>Cargando perfil...</p></div>
      </div>
    );
  }

  return (
    <div className="ddg-dash-wrapper">
      <style>{CSS}</style>
      <div className="ddg-dash-bg-yellow" /><div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Mi Perfil</h1>
          <p className="ddg-dash-subtitle">Gestiona tu información y servicios de la comunidad</p>
        </div>

        <div className="sp-outer">

          {/* ══ TOP: Avatar + Info ══ */}
          <div className="sp-top">

            {/* Avatar card */}
            <div className="sp-card" style={{ textAlign: "center" }}>
              <div className="sp-avatar">{initials}</div>
              <h2 className="sp-name">{user.name}</h2>
              <span className="sp-badge" style={{ background: `${meta.color}20`, color: meta.color }}>
                <MdShield size={12} /> {meta.label}
              </span>
              <p className="sp-desc">{meta.description}</p>
              <button className="sp-edit-btn" onClick={() => setIsOpen(true)}>
                <MdEdit size={16} /> Editar Perfil
              </button>
            </div>

            {/* Info card */}
            <div className="sp-card">
              <p className="sp-sec-label">Información Personal</p>
              <div className="sp-fields-grid">
                {fields.map((f, i) => (
                  <div className="sp-field" key={i}>
                    <div className="sp-field-icon">{f.icon}</div>
                    <div>
                      <p className="sp-field-lbl">{f.label}</p>
                      <p className="sp-field-val">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ BOTTOM: Payment — full width, only for normal users ══ */}
          {showPay && (
            <div className="sp-card">
              <p className="sp-sec-label">Pago de Vigilancia</p>

              <div className="sp-pay-section">

                {/* Form side */}
                <form onSubmit={onSubmitPay} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                  <div>
                    <label className="sp-pay-label"><MdCreditCard size={13}/> Número de tarjeta</label>
                    <input
                      className={`sp-pay-input${errors.numberTarget ? " err" : ""}`}
                      type="text" maxLength={19} placeholder="0000 0000 0000 0000"
                      {...register("numberTarget", { required: "Requerido" })}
                    />
                    {errors.numberTarget && <p className="sp-pay-err">{errors.numberTarget.message as string}</p>}
                  </div>

                  <div>
                    <label className="sp-pay-label"><MdDescription size={13}/> Concepto de pago</label>
                    <input
                      className={`sp-pay-input${errors.context ? " err" : ""}`}
                      type="text" placeholder="Ej: Cuota mensual de vigilancia"
                      {...register("context", { required: "Requerido" })}
                    />
                    {errors.context && <p className="sp-pay-err">{errors.context.message as string}</p>}
                  </div>

                  <div className="sp-pay-row">
                    <div>
                      <label className="sp-pay-label"><MdAttachMoney size={13}/> Monto ($)</label>
                      <input
                        className={`sp-pay-input${errors.amount ? " err" : ""}`}
                        type="number" min="1" step="0.01" placeholder="25.00"
                        {...register("amount", { required: "Requerido", valueAsNumber: true })}
                      />
                      {errors.amount && <p className="sp-pay-err">{errors.amount.message as string}</p>}
                    </div>
                    <div>
                      <label className="sp-pay-label"><MdLock size={13}/> CVC</label>
                      <input
                        className={`sp-pay-input${errors.cvc ? " err" : ""}`}
                        type="text" maxLength={4} placeholder="123"
                        {...register("cvc", { required: "Requerido" })}
                      />
                      {errors.cvc && <p className="sp-pay-err">{errors.cvc.message as string}</p>}
                    </div>
                  </div>

                  <button className="sp-pay-submit" type="submit" disabled={isSubmitting}>
                    <MdCheckCircle size={19}/>
                    {isSubmitting ? "Procesando..." : "Confirmar Pago"}
                  </button>
                </form>

                {/* Right side: card visual + info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Bank card visual */}
                  <div className="sp-bank-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                      <span className="sp-bank-logo">Comunidad DDG</span>
                      <MdSecurity size={22} style={{ opacity: 0.5 }} />
                    </div>
                    <div className="sp-bank-chip" />
                    <div className="sp-bank-num">
                      {formatCardDisplay(cardNumber)}
                    </div>
                    <div className="sp-bank-footer">
                      <div>
                        <p className="sp-bank-lbl">Titular</p>
                        <p className="sp-bank-val">{user.name?.toUpperCase().slice(0, 20)}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p className="sp-bank-lbl">Válida hasta</p>
                        <p className="sp-bank-val">12 / 28</p>
                      </div>
                    </div>
                  </div>

                  {/* Info bullets */}
                  <div className="sp-info-bullets">
                    {[
                      "Tu pago financia la vigilancia comunitaria 24/7",
                      "Recibirás un comprobante PDF automáticamente",
                      "Tu datos están protegidos y encriptados",
                    ].map((text, i) => (
                      <div className="sp-bullet" key={i}>
                        <MdCheckCircle size={14} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Popup */}
      <Popup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        lockScroll modal closeOnDocumentClick={false}
        position="top center"
        overlayStyle={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        contentStyle={{ maxHeight: "95%", overflow: "auto", borderRadius: "24px", border: "none", padding: 0, background: "transparent" }}
      >
        <EditForm user={user} close={() => setIsOpen(false)} />
      </Popup>
    </div>
  );
}
