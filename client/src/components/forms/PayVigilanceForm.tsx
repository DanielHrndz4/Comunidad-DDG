import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

import { IPayment } from "../../interfaces/IPayment";
import { addPayment } from "../../services/payment.service";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
  close: () => void;
}

export default function PayVigilanceForm({
  close,
}: Props) {

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<IPayment>();

  const navigate = useNavigate();

  const numberTargetValue =
    watch("numberTarget") || "";

  const contextValue =
    watch("context") || "";

  const amountValue =
    watch("amount");

  const cvcValue =
    watch("cvc") || "";

  const validarNumeroTarjeta = (
    numberTarget: string
  ): boolean => {

    const cleanNumber =
      numberTarget.replace(/\D/g, "");

    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

    let suma = 0;
    let alternar = false;

    for (
      let i = cleanNumber.length - 1;
      i >= 0;
      i--
    ) {

      let digito = parseInt(
        cleanNumber.charAt(i),
        10
      );

      if (alternar) {

        digito *= 2;

        if (digito > 9) {
          digito -= 9;
        }
      }

      suma += digito;

      alternar = !alternar;
    }

    return suma % 10 === 0;
  };

  const validarCVC = (
    cvc: string
  ): boolean => {

    return /^\d{3,4}$/.test(cvc);
  };

  const generarFacturaPDF = (
    datos: IPayment
  ) => {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Factura de Pago",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Número de tarjeta: **** **** **** ${datos.numberTarget.slice(-4)}`,
      20,
      40
    );

    doc.text(
      `Contexto: ${datos.context}`,
      20,
      50
    );

    doc.text(
      `Monto: $${datos.amount}`,
      20,
      60
    );

    doc.text(
      `Fecha: ${new Date().toLocaleDateString()}`,
      20,
      70
    );

    doc.save(
      `Factura_${Date.now()}.pdf`
    );
  };

  const formatCardNumber = (
    value: string
  ) => {

    const cleaned =
      value.replace(/\D/g, "")
        .slice(0, 16);

    const formatted =
      cleaned.replace(
        /(.{4})/g,
        "$1 "
      ).trim();

    return formatted;
  };

  const onSubmit = async (
    values: IPayment
  ) => {

    const {
      numberTarget,
      cvc,
    } = values;

    if (
      !validarNumeroTarjeta(numberTarget)
    ) {

      setError("numberTarget", {
        type: "manual",
        message:
          "Número de tarjeta inválido",
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
        title:
          "¡Pago realizado con éxito!",
        text:
          "Tu transacción se ha completado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      generarFacturaPDF(values);

      close();

      navigate("/admin");

    } catch {

      Swal.fire({
        icon: "error",
        title: "Error en el pago",
        text:
          "No se pudo completar la transacción.",
      });
    }
  };

  return (
    <FormModal title="Pago de Vigilancia">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >

        <FormInput
          type="text"
          label="Número de tarjeta"
          placeholder="1234 5678 9012 3456"
          maxLength={19}

          error={
            errors.numberTarget?.message
          }

          success={
            numberTargetValue.replace(/\D/g, "")
              .length === 16
          }

          {...register("numberTarget", {
            required:
              "El número de tarjeta es requerido",

            onChange: (e) => {

              e.target.value =
                formatCardNumber(
                  e.target.value
                );
            },
          })}
        />

        <FormInput
          type="text"
          label="Contexto"
          placeholder="Pago de vigilancia"
          error={
            errors.context?.message
          }
          success={
            contextValue.trim().length >= 5
          }
          {...register("context", {
            required:
              "El contexto es requerido",
          })}
        />

        <FormInput
          type="number"
          label="Monto"
          placeholder="0.00"
          error={
            errors.amount?.message
          }
          success={
            Number(amountValue) > 0
          }
          {...register("amount", {
            required:
              "El monto es requerido",
            valueAsNumber: true,
          })}
        />

        <FormInput
          type="password"
          label="CVC"
          placeholder="123"
          maxLength={3}

          error={
            errors.cvc?.message
          }

          success={
            cvcValue.length === 3
          }

          {...register("cvc", {
            required:
              "El CVC es requerido",

            pattern: {
              value: /^[0-9]{3}$/,
              message:
                "El CVC debe tener 3 dígitos",
            },

            onChange: (e) => {

              e.target.value =
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 3);
            },
          })}
        />

        <div
          className="
                        flex
                        justify-between
                        items-center
                        pt-3
                    "
        >

          <SecondaryButton
            type="button"
            onClick={close}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit">
            Pagar
          </PrimaryButton>

        </div>

      </form>

    </FormModal>
  );
}