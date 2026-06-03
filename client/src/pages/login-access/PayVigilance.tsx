import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import FormModal from "../../components/ui/FormModal";
import PrimaryButton from "../../components/ui/PrimaryButton";

interface PayFormData {
  numberTarget: string;
  context: string;
  amount: number;
  cvc: string;
}

export default function PayVigilance() {
  const { addPay, user } = useAuth();
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PayFormData>();

  const getErrorMessage = (value: unknown): string | undefined =>
    typeof value === "string" ? value : undefined;

  const validarNumeroTarjeta = (numberTarget: string): boolean => {
    const cleanNumber = numberTarget.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;
    let suma = 0;
    let alternar = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digito = parseInt(cleanNumber.charAt(i), 10);
      if (alternar) { digito *= 2; if (digito > 9) digito -= 9; }
      suma += digito;
      alternar = !alternar;
    }
    return suma % 10 === 0;
  };

  const validarCVC = (cvc: string): boolean => /^\d{3,4}$/.test(cvc);

  const generarFacturaPDF = (datos: PayFormData): void => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Factura de Pago", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nombre del usuario: ${user?.name || "Usuario"}`, 20, 40);
    doc.text(`Número de tarjeta: **** **** **** ${datos.numberTarget.slice(-4)}`, 20, 50);
    doc.text(`Contexto: ${datos.context}`, 20, 60);
    doc.text(`Monto: $${datos.amount}`, 20, 70);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 80);
    doc.save(`Factura_${new Date().getTime()}.pdf`);
  };

  const onSubmit = handleSubmit(async (values: PayFormData) => {
    if (!validarNumeroTarjeta(values.numberTarget)) {
      setError("numberTarget", { type: "manual", message: "Número de tarjeta inválido" });
      return;
    } else { clearErrors("numberTarget"); }

    if (!validarCVC(values.cvc)) {
      setError("cvc", { type: "manual", message: "CVC debe tener 3 o 4 dígitos" });
      return;
    } else { clearErrors("cvc"); }

    await addPay(values);
    generarFacturaPDF(values);

    await Swal.fire({
      title: "¡Pago realizado!",
      text: "Tu factura se ha descargado automáticamente.",
      icon: "success",
      background: "#1c1c1c",
      color: "#ededed",
      confirmButtonColor: "#3ecf8e",
      confirmButtonText: "Aceptar",
    });

    navigate("/user");
  });

  // Estilos de input idénticos a FormInput
  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%",
    backgroundColor: "#2a2a2a",
    border: `1px solid ${
      errors[fieldName as keyof PayFormData]
        ? "#ef4444"
        : focusedField === fieldName
        ? "#3ecf8e"
        : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#ededed",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#9ca3af",
    marginLeft: "4px",
    marginBottom: "6px",
    display: "block",
  };

  const errorMsgStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
    marginLeft: "4px",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", backgroundColor: "transparent" }}>
      <FormModal title="Pago de Vigilancia">
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            margin: 0,
            width: "100%",
            maxWidth: "100%",
          }}
        >

          {/* Número de tarjeta */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Número de tarjeta</label>
            <input
              type="text"
              maxLength={19}
              placeholder="•••• •••• •••• ••••"
              {...register("numberTarget", { required: "El número de tarjeta es requerido" })}
              style={getInputStyle("numberTarget")}
              onFocus={() => setFocusedField("numberTarget")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.numberTarget && <span style={errorMsgStyle}>{getErrorMessage(errors.numberTarget.message)}</span>}
          </div>

          {/* Concepto */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Concepto de pago</label>
            <input
              type="text"
              placeholder="Ej: Cuota mensual enero 2025"
              {...register("context", { required: "El concepto es requerido" })}
              style={getInputStyle("context")}
              onFocus={() => setFocusedField("context")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.context && <span style={errorMsgStyle}>{getErrorMessage(errors.context.message)}</span>}
          </div>

          {/* Monto y CVC en grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>Monto ($)</label>
              <input
                type="number"
                min={0}
                placeholder="0.00"
                {...register("amount", { required: "El monto es requerido", valueAsNumber: true })}
                style={getInputStyle("amount")}
                onFocus={() => setFocusedField("amount")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.amount && <span style={errorMsgStyle}>{getErrorMessage(errors.amount.message)}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>CVC</label>
              <input
                type="text"
                maxLength={4}
                placeholder="•••"
                {...register("cvc", { required: "El CVC es requerido" })}
                style={getInputStyle("cvc")}
                onFocus={() => setFocusedField("cvc")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.cvc && <span style={errorMsgStyle}>{getErrorMessage(errors.cvc.message)}</span>}
            </div>
          </div>

          {/* Divisor */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* Botones */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/user")}
              style={{
                backgroundColor: "transparent",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#ededed"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              Cancelar
            </button>

            <PrimaryButton type="submit">
              Confirmar Pago
            </PrimaryButton>
          </div>

        </form>
      </FormModal>
    </div>
  );
}