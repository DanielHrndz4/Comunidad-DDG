import { useState } from "react";
import { useForm } from "react-hook-form";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { MdCreditCard, MdLock, MdAttachMoney, MdDescription, MdSecurity, MdCheckCircle } from "react-icons/md";

import type { IPayment } from "../../interfaces/IPayment";
import { addPayment } from "../../services/payment.service";
import { useAuth } from "../../context/AuthContext";
import FormModal from "../ui/FormModal";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
  close: () => void;
}

export default function PayVigilanceForm({ close }: Props) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<IPayment>({
    defaultValues: {
      context: "Cuota de Vigilancia Comunitaria",
      amount: 25.00,
    }
  });

  const cardNumber = watch("numberTarget") || "";
  const cardHolder = user?.name || "TITULAR DE LA TARJETA";
  const context = watch("context") || "";
  const amount = watch("amount") || 0;
  const cvc = watch("cvc") || "";

  // Determine card type based on number
  const getCardType = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    return "generic";
  };

  const cardType = getCardType(cardNumber);

  // Formatting helper
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  const validarNumeroTarjeta = (numberTarget: string): boolean => {
    const cleanNumber = numberTarget.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    let suma = 0;
    let alternar = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digito = parseInt(cleanNumber.charAt(i), 10);
      if (alternar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      suma += digito;
      alternar = !alternar;
    }

    return suma % 10 === 0;
  };

  const generarFacturaPDF = (datos: IPayment) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });

      // Colors
      const primaryColor = [45, 189, 161]; // #2dbda1
      const darkColor = [20, 43, 54]; // #142B36
      const grayColor = [100, 100, 100];

      // Draw premium receipt header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 148, 25, "F");

      // Header Text
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("COMPROBANTE DE PAGO", 12, 16);

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.text("COMUNIDAD DDG", 110, 16);

      // Receipt details block
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Detalle de Transacción", 12, 38);

      // Horizontal line separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(12, 42, 136, 42);

      // Information fields
      doc.setFontSize(10);
      let y = 50;

      const fields = [
        { label: "ID Transacción:", val: `TXN-${Date.now().toString().slice(-8)}` },
        { label: "Vecino:", val: user?.name || "Usuario" },
        { label: "Email:", val: user?.email || "—" },
        { label: "Fecha y Hora:", val: new Date().toLocaleDateString("es-SV", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) },
        { label: "Concepto:", val: datos.context },
        { label: "Método de Pago:", val: `Tarjeta **** **** **** ${datos.numberTarget.slice(-4)}` },
        { label: "Monto Pagado:", val: `$${datos.amount}.00 USD`, isBoldVal: true },
      ];

      fields.forEach((f) => {
        doc.setFont("Helvetica", "bold");
        doc.text(f.label, 12, y);
        
        if (f.isBoldVal) {
          doc.setFont("Helvetica", "bold");
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setFontSize(12);
        } else {
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
          doc.setFontSize(10);
        }
        
        doc.text(f.val, 50, y);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]); // reset
        doc.setFontSize(10); // reset
        y += 10;
      });

      // Separation Line before footer
      doc.line(12, y + 2, 136, y + 2);

      // Footer
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("Este documento sirve como comprobante de pago oficial de la cuota de vigilancia comunitaria.", 12, y + 10);
      doc.text("¡Gracias por contribuir a mantener nuestra comunidad segura!", 12, y + 14);

      // Save PDF
      doc.save(`Recibo_Pago_${Date.now().toString().slice(-6)}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  const onSubmit = async (values: IPayment) => {
    const { numberTarget, cvc } = values;

    if (!validarNumeroTarjeta(numberTarget)) {
      setError("numberTarget", {
        type: "manual",
        message: "Número de tarjeta inválido",
      });
      return;
    }
    clearErrors("numberTarget");

    if (!/^\d{3,4}$/.test(cvc)) {
      setError("cvc", {
        type: "manual",
        message: "CVC inválido",
      });
      return;
    }
    clearErrors("cvc");

    try {
      // Simulate processing latency for rich user feedback
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await addPayment(values);

      await Swal.fire({
        icon: "success",
        title: "¡Pago realizado con éxito!",
        text: "Tu transacción se ha completado y se ha registrado.",
        showConfirmButton: false,
        timer: 2000,
      });

      generarFacturaPDF(values);
      close();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error en el pago",
        text: "No se pudo completar la transacción.",
      });
    }
  };

  const formatCardDisplay = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const padded = digits.padEnd(16, "•");
    return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
  };

  return (
    <FormModal title="Simulador de Pago de Vigilancia">
      <style>{`
        .sim-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 8px 4px;
        }
        
        .sim-card-visual {
          background: linear-gradient(135deg, #142B36 0%, #1e4060 60%, #2a5a70 100%);
          border-radius: 20px;
          padding: 24px;
          color: #ffffff;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 12px 30px rgba(20,43,54,0.25);
          position: relative;
          overflow: hidden;
          font-family: 'Courier New', Courier, monospace;
        }

        .sim-card-visual::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(45, 189, 161, 0.12);
        }

        .sim-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .sim-card-logo {
          font-weight: bold;
          font-size: 14px;
          letter-spacing: 1px;
          color: #2dbda1;
        }

        .sim-card-chip {
          width: 38px;
          height: 28px;
          background: linear-gradient(135deg, #fcd068 0%, #d89614 100%);
          border-radius: 6px;
          margin-top: 14px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }

        .sim-card-number {
          font-size: 20px;
          letter-spacing: 2px;
          margin: 18px 0 12px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
        }

        .sim-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 11px;
          text-transform: uppercase;
        }

        .sim-card-lbl {
          font-size: 8px;
          opacity: 0.6;
          margin-bottom: 2px;
        }

        .sim-card-val {
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .sim-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sim-label {
          font-size: 13px;
          font-weight: 600;
          color: #142B36;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sim-input {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(20,43,54,0.1);
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
          background: #ffffff;
        }

        .sim-input:focus {
          border-color: #2dbda1;
          box-shadow: 0 0 0 3px rgba(45,189,161,0.12);
        }

        .sim-input.err {
          border-color: #e54a55;
        }

        .sim-error-msg {
          color: #e54a55;
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
        }

        .sim-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .sim-card-type-icon {
          font-size: 12px;
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
        }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)} className="sim-container">
        {/* Bank Card Visual representation */}
        <div className="sim-card-visual">
          <div className="sim-card-header">
            <span className="sim-card-logo">Comunidad DDG</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {cardType !== "generic" && <span className="sim-card-type-icon">{cardType.toUpperCase()}</span>}
              <MdSecurity size={20} style={{ opacity: 0.6 }} />
            </div>
          </div>
          <div className="sim-card-chip" />
          <div className="sim-card-number">
            {formatCardDisplay(cardNumber)}
          </div>
          <div className="sim-card-footer">
            <div>
              <p className="sim-card-lbl">Titular de la tarjeta</p>
              <p className="sim-card-val">{cardHolder.toUpperCase().slice(0, 22)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="sim-card-lbl">Expira</p>
              <p className="sim-card-val">12 / 29</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="sim-input-group">
          <label className="sim-label">
            <MdCreditCard size={16} /> Número de Tarjeta
          </label>
          <input
            type="text"
            placeholder="4000 1234 5678 9010"
            maxLength={19}
            className={`sim-input ${errors.numberTarget ? "err" : ""}`}
            {...register("numberTarget", {
              required: "El número de tarjeta es requerido",
              onChange: (e) => {
                setValue("numberTarget", formatCardNumber(e.target.value));
              },
            })}
          />
          {errors.numberTarget && <p className="sim-error-msg">{errors.numberTarget.message}</p>}
        </div>

        <div className="sim-input-group">
          <label className="sim-label">
            <MdDescription size={16} /> Concepto de Pago
          </label>
          <input
            type="text"
            placeholder="Ej. Cuota mensual de vigilancia"
            className={`sim-input ${errors.context ? "err" : ""}`}
            {...register("context", { required: "El concepto es requerido" })}
          />
          {errors.context && <p className="sim-error-msg">{errors.context.message}</p>}
        </div>

        <div className="sim-input-row">
          <div className="sim-input-group">
            <label className="sim-label">
              <MdAttachMoney size={16} /> Monto ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="25.00"
              className={`sim-input ${errors.amount ? "err" : ""}`}
              {...register("amount", {
                required: "El monto es requerido",
                valueAsNumber: true,
              })}
            />
            {errors.amount && <p className="sim-error-msg">{errors.amount.message}</p>}
          </div>

          <div className="sim-input-group">
            <label className="sim-label">
              <MdLock size={16} /> CVC / CVV
            </label>
            <input
              type="password"
              placeholder="123"
              maxLength={4}
              className={`sim-input ${errors.cvc ? "err" : ""}`}
              {...register("cvc", {
                required: "El CVC es requerido",
                onChange: (e) => {
                  setValue("cvc", e.target.value.replace(/\D/g, "").slice(0, 4));
                }
              })}
            />
            {errors.cvc && <p className="sim-error-msg">{errors.cvc.message}</p>}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <SecondaryButton type="button" onClick={close} disabled={isSubmitting}>
            Cancelar
          </SecondaryButton>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: "#2dbda1",
              color: "#ffffff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(45,189,161,0.3)",
              transition: "all 0.25s ease",
            }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid #ffffff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite"
                }} />
                Procesando Pago...
              </>
            ) : (
              <>
                <MdCheckCircle size={20} />
                Confirmar Pago
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </FormModal>
  );
}