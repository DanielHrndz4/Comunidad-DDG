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

  return (
    <div className="min-h-screen flex items-center justify-center p-5 sm:p-10 bg-transparent">
      <FormModal title="Pago de Vigilancia">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 bg-transparent shadow-none p-0 m-0 w-full"
        >

          {/* Número de tarjeta */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-400 ml-1 mb-1.5 block">Número de tarjeta</label>
            <input
              type="text"
              maxLength={19}
              placeholder="•••• •••• •••• ••••"
              {...register("numberTarget", { required: "El número de tarjeta es requerido" })}
              className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-200 ${ errors.numberTarget ? "border-red-500" : focusedField === "numberTarget" ? "border-emerald-500" : "border-white/10"}`}
              onFocus={() => setFocusedField("numberTarget")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.numberTarget && <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage(errors.numberTarget.message)}</span>}
          </div>

          {/* Concepto */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-400 ml-1 mb-1.5 block">Concepto de pago</label>
            <input
              type="text"
              placeholder="Ej: Cuota mensual enero 2025"
              {...register("context", { required: "El concepto es requerido" })}
              className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-200 ${errors.context ? "border-red-500" : focusedField === "context" ? "border-emerald-500" : "border-white/10"}`}
              onFocus={() => setFocusedField("context")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.context && <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage(errors.context.message)}</span>}
          </div>

          {/* Monto y CVC en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-400 ml-1 mb-1.5 block">Monto ($)</label>
              <input
                type="number"
                min={0}
                placeholder="0.00"
                {...register("amount", { required: "El monto es requerido", valueAsNumber: true })}
                className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-200 ${errors.amount ? "border-red-500" : focusedField === "amount" ? "border-emerald-500" : "border-white/10"}`}
                onFocus={() => setFocusedField("amount")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.amount && <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage(errors.amount.message)}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-400 ml-1 mb-1.5 block">CVC</label>
              <input
                type="text"
                maxLength={4}
                placeholder="•••"
                {...register("cvc", { required: "El CVC es requerido" })}
                className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-200 ${errors.cvc ? "border-red-500" : focusedField === "cvc" ? "border-emerald-500" : "border-white/10"}`}
                onFocus={() => setFocusedField("cvc")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.cvc && <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage(errors.cvc.message)}</span>}
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-white/5" />

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/user")}
              className="w-full sm:w-auto bg-transparent text-slate-400 border border-white/10 hover:border-white/25 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
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