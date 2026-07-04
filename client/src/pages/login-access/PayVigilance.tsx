import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { jsPDF } from "jspdf";
import { MdCreditCard, MdLock, MdAttachMoney, MdDescription, MdCheckCircle } from "react-icons/md";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import "./LoginAccess.css";

interface PayFormData {
  numberTarget: string;
  context: string;
  amount: number;
  cvc: string;
}

export default function PayVigilance() {
  const { addPay, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PayFormData>();

  const cardNumber = watch("numberTarget") || "";
  const formatCard = (v: string) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

  const getErrorMessage = (value: unknown): string | undefined =>
    typeof value === "string" ? value : undefined;

  const validarNumeroTarjeta = (numberTarget: string): boolean => {
    const clean = numberTarget.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(clean)) return false;
    let suma = 0, alternar = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let d = parseInt(clean.charAt(i), 10);
      if (alternar) { d *= 2; if (d > 9) d -= 9; }
      suma += d; alternar = !alternar;
    }
    return suma % 10 === 0;
  };

  const validarCVC = (cvc: string): boolean => /^\d{3,4}$/.test(cvc);

  const generarFacturaPDF = (datos: PayFormData): void => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(45, 189, 161);
    doc.text("Comunidad DDG", 20, 20);
    doc.setFontSize(16);
    doc.setTextColor(20, 43, 54);
    doc.text("Comprobante de Pago", 20, 32);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 37, 190, 37);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Vecino: ${user?.name || "Usuario"}`, 20, 48);
    doc.text(`Tarjeta: **** **** **** ${datos.numberTarget.replace(/\D/g, "").slice(-4)}`, 20, 58);
    doc.text(`Concepto: ${datos.context}`, 20, 68);
    doc.text(`Monto: $${datos.amount}.00`, 20, 78);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-SV")}`, 20, 88);
    doc.text(`ID de transacción: TXN-${Date.now()}`, 20, 98);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Este documento es un comprobante de pago válido.", 20, 115);
    doc.save(`Factura_Vigilancia_${Date.now()}.pdf`);
  };

  const onSubmit = handleSubmit(async (values: PayFormData) => {
    if (!validarNumeroTarjeta(values.numberTarget)) {
      setError("numberTarget", { type: "manual", message: "Número de tarjeta inválido (verifica los dígitos)" });
      return;
    } else clearErrors("numberTarget");

    if (!validarCVC(values.cvc)) {
      setError("cvc", { type: "manual", message: "CVC inválido (3 o 4 dígitos)" });
      return;
    } else clearErrors("cvc");

    await addPay(values);
    generarFacturaPDF(values);

    await Swal.fire({
      title: "¡Pago exitoso!",
      text: "Tu comprobante PDF ha sido generado y descargado.",
      icon: "success",
      confirmButtonColor: "#2dbda1",
      confirmButtonText: "Aceptar",
    });

    navigate("/user");
  });

  return (
    <div className="ddg-dash-wrapper">
      <style>{`
        .pay-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          width: 100%;
          max-width: 900px;
        }
        @media (max-width: 750px) {
          .pay-grid { grid-template-columns: 1fr; }
        }
        .pay-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(20,43,54,.10);
          padding: 32px 28px;
        }
        .pay-card-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #2dbda1;
          margin: 0 0 22px 0;
        }
        .pay-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }
        .pay-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .6px;
          text-transform: uppercase;
          color: #6e6e73;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pay-label svg { color: #2dbda1; }
        .pay-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e8e8ed;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Montserrat', sans-serif;
          color: #142B36;
          background: #fafafa;
          transition: border-color .2s;
          box-sizing: border-box;
          outline: none;
        }
        .pay-input:focus { border-color: #2dbda1; background: #fff; }
        .pay-input.has-error { border-color: #e54a55; }
        .pay-err { color: #e54a55; font-size: 12px; font-weight: 600; margin: 0; }
        .pay-submit-btn {
          background: linear-gradient(135deg, #2dbda1, #1a9e86);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all .25s ease;
          box-shadow: 0 4px 14px rgba(45,189,161,.3);
          font-family: 'Montserrat', sans-serif;
          margin-top: 8px;
        }
        .pay-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,189,161,.45);
        }
        .pay-submit-btn:disabled { opacity: .65; cursor: not-allowed; }
        /* Card Visual */
        .pay-visual-card {
          background: linear-gradient(135deg, #142B36, #2a5a70);
          border-radius: 18px;
          padding: 28px 24px;
          color: #fff;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 12px 40px rgba(20,43,54,.3);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .pay-visual-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(45,189,161,.15);
        }
        .pay-visual-card::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -20px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,.05);
        }
        .pay-vc-chip {
          width: 42px; height: 30px;
          background: linear-gradient(135deg, #fcc33a, #e8a800);
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        .pay-vc-number {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: 3px;
          font-family: 'Courier New', monospace;
          position: relative;
          z-index: 1;
        }
        .pay-vc-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
        }
        .pay-vc-label {
          font-size: 10px;
          opacity: .6;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 3px 0;
        }
        .pay-vc-val {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }
        .pay-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f2f5;
          font-size: 13px;
          color: #6e6e73;
        }
        .pay-info-row:last-child { border-bottom: none; }
        .pay-info-row svg { color: #2dbda1; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">Comunidad DDG</p>
          <h1 className="ddg-dash-title">Pago de Vigilancia</h1>
          <p className="ddg-dash-subtitle">Realiza tu aporte mensual al servicio de seguridad comunitaria</p>
        </div>

        <div className="pay-grid">
          {/* Form */}
          <div className="pay-card">
            <p className="pay-card-title">Datos del pago</p>
            <form onSubmit={onSubmit}>
              {/* Número de tarjeta */}
              <div className="pay-field">
                <label className="pay-label">
                  <MdCreditCard size={14} /> Número de tarjeta
                </label>
                <input
                  className={`pay-input${errors.numberTarget ? " has-error" : ""}`}
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  {...register("numberTarget", { required: "El número de tarjeta es requerido" })}
                />
                {errors.numberTarget && (
                  <p className="pay-err">{getErrorMessage(errors.numberTarget.message)}</p>
                )}
              </div>

              {/* Concepto */}
              <div className="pay-field">
                <label className="pay-label">
                  <MdDescription size={14} /> Concepto de pago
                </label>
                <input
                  className={`pay-input${errors.context ? " has-error" : ""}`}
                  type="text"
                  placeholder="Ej: Cuota mensual de vigilancia"
                  {...register("context", { required: "El concepto es requerido" })}
                />
                {errors.context && (
                  <p className="pay-err">{getErrorMessage(errors.context.message)}</p>
                )}
              </div>

              {/* Monto + CVC en fila */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="pay-field" style={{ marginBottom: 0 }}>
                  <label className="pay-label">
                    <MdAttachMoney size={14} /> Monto ($)
                  </label>
                  <input
                    className={`pay-input${errors.amount ? " has-error" : ""}`}
                    type="number"
                    placeholder="25.00"
                    step="0.01"
                    min="1"
                    {...register("amount", { required: "El monto es requerido", valueAsNumber: true })}
                  />
                  {errors.amount && (
                    <p className="pay-err">{getErrorMessage(errors.amount.message)}</p>
                  )}
                </div>

                <div className="pay-field" style={{ marginBottom: 0 }}>
                  <label className="pay-label">
                    <MdLock size={14} /> CVC
                  </label>
                  <input
                    className={`pay-input${errors.cvc ? " has-error" : ""}`}
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    {...register("cvc", { required: "El CVC es requerido" })}
                  />
                  {errors.cvc && (
                    <p className="pay-err">{getErrorMessage(errors.cvc.message)}</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <button className="pay-submit-btn" type="submit" disabled={isSubmitting}>
                  <MdCheckCircle size={20} />
                  {isSubmitting ? "Procesando..." : "Confirmar Pago"}
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: card visual + info */}
          <div>
            {/* Card Visual */}
            <div className="pay-visual-card">
              <div className="pay-vc-chip" />
              <div className="pay-vc-number">
                {cardNumber
                  ? formatCard(cardNumber).padEnd(19, "•").match(/.{1,4}/g)?.join(" ")
                  : "•••• •••• •••• ••••"}
              </div>
              <div className="pay-vc-footer">
                <div>
                  <p className="pay-vc-label">Titular</p>
                  <p className="pay-vc-val">{user?.name?.toUpperCase() || "VECINO DDG"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="pay-vc-label">Válida hasta</p>
                  <p className="pay-vc-val">12/28</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="pay-card">
              <p className="pay-card-title">¿Por qué pagar?</p>
              {[
                "Financia el servicio de vigilancia comunitaria 24/7",
                "Cubre materiales, uniformes y equipos del personal",
                "Recibirás un comprobante PDF automáticamente",
                "Tu aporte protege a toda la comunidad",
              ].map((text, i) => (
                <div className="pay-info-row" key={i}>
                  <MdCheckCircle size={16} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}