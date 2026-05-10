import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

import { IPayment } from "../../interfaces/IPayment";
import { addPayment } from "../../services/payment.service";

interface Props {
  close: () => void;
}

export default function PayVigilanceForUserNormal({
  close,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IPayment>();

  const navigate = useNavigate();

  const validarNumeroTarjeta = (
    numberTarget: string
  ): boolean => {
    const cleanNumber = numberTarget.replace(/\D/g, "");

    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

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

  const validarCVC = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
  };

  const generarFacturaPDF = (datos: IPayment) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Factura de Pago", 20, 20);

    doc.setFontSize(12);

    doc.text(
      `Número de tarjeta: **** **** **** ${datos.numberTarget.slice(-4)}`,
      20,
      40
    );

    doc.text(`Contexto: ${datos.context}`, 20, 50);
    doc.text(`Monto: $${datos.amount}`, 20, 60);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 70);

    doc.save(`Factura_${Date.now()}.pdf`);
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

    if (!validarCVC(cvc)) {
      setError("cvc", {
        type: "manual",
        message: "CVC inválido",
      });

      return;
    }

    clearErrors("cvc");

    try {
      await addPayment(values);

      await Swal.fire({
        icon: "success",
        title: "¡Pago realizado con éxito!",
        text: "Tu transacción se ha completado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      generarFacturaPDF(values);

      close();

      navigate("/user");

    } catch {
      Swal.fire({
        icon: "error",
        title: "Error en el pago",
        text: "No se pudo completar la transacción.",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-lg border border-[#E5E5E7]">
      <h2 className="text-xl font-semibold mb-6">
        Pago de Vigilancia
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <label>Número de tarjeta</label>

          <input
            type="text"
            {...register("numberTarget", {
              required: "El número de tarjeta es requerido",
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.numberTarget && (
            <p className="text-red-500 text-sm">
              {errors.numberTarget.message}
            </p>
          )}
        </div>

        <div>
          <label>Contexto</label>

          <input
            type="text"
            {...register("context", {
              required: "El contexto es requerido",
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.context && (
            <p className="text-red-500 text-sm">
              {errors.context.message}
            </p>
          )}
        </div>

        <div>
          <label>Monto</label>

          <input
            type="number"
            {...register("amount", {
              required: "El monto es requerido",
              valueAsNumber: true,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.amount && (
            <p className="text-red-500 text-sm">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div>
          <label>CVC</label>

          <input
            type="text"
            {...register("cvc", {
              required: "El CVC es requerido",
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.cvc && (
            <p className="text-red-500 text-sm">
              {errors.cvc.message}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={close}
          >
            Cancelar
          </button>

          <button type="submit">
            Pagar
          </button>
        </div>
      </form>
    </div>
  );
}