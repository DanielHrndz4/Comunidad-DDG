import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useTask } from "../../context/TaskContext";
import VisitCard from "../../components/VisitCard";

interface VisitFormData {
  visitName: string;
  dui: string;
  numPlaca: string;
  visitHouse: number;
}

interface VisitItem {
  _id?: string;
  visitName: string;
  dui: string;
  numPlaca: string;
  visitHouse: number | string;
  date: string;
}

export default function Visits() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VisitFormData>({
    defaultValues: {
      visitName: "",
      dui: "",
      numPlaca: "",
      visitHouse: 0,
    },
    mode: "onSubmit",
  });

  const {
    createVisitVigilant,
    getVisitVigilant,
    addVisit,
  } = useTask();

  const getErrorMessage = (
    value: unknown
  ): string | undefined =>
    typeof value === "string" ? value : undefined;

  useEffect(() => {
    getVisitVigilant();
  }, [getVisitVigilant]);

  const preSubmitTrim = (
    data: VisitFormData
  ): VisitFormData => {
    const cleaned: VisitFormData = {
      visitName: data.visitName.trim(),
      dui: data.dui.trim(),
      numPlaca: data.numPlaca.trim(),
      visitHouse: data.visitHouse,
    };

    setValue("visitName", cleaned.visitName, {
      shouldValidate: true,
    });
    setValue("dui", cleaned.dui, {
      shouldValidate: true,
    });
    setValue("numPlaca", cleaned.numPlaca, {
      shouldValidate: true,
    });
    setValue("visitHouse", cleaned.visitHouse, {
      shouldValidate: true,
    });

    return cleaned;
  };

  const onValid = async (
    data: VisitFormData
  ): Promise<void> => {
    const payload = preSubmitTrim(data);

    try {
      await createVisitVigilant(payload);

      Swal.fire({
        title: "¡Visita creada!",
        text: "La visita se ha creado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Aceptar",
        background: "#fefefe",
        color: "#1e293b",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error: unknown) {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la visita.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const onInvalid = (): void => {
    Swal.fire({
      title: "Campos incompletos",
      text: "Revisa los campos resaltados e inténtalo de nuevo.",
      icon: "warning",
      confirmButtonColor: "#f59e0b",
    });
  };

  const onSubmit = handleSubmit(onValid, onInvalid);

  const visits = (addVisit as VisitItem[])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  return (
    <div className="w-full flex flex-col items-center px-16 py-28 pb-40">
      <div className="w-full flex flex-col items-center">
        <h3 className="text-[2rem] font-bold tracking-wide mb-20 text-[#c7d2fe] text-center [text-shadow:0_4px_18px_rgba(99,102,241,0.18)]">
          Registro de visitas
        </h3>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-[420px] px-24 py-28 rounded-[22px] bg-[#e5e7eb]/[0.92] border border-white/35 shadow-[0_10px_30px_rgba(15,23,42,0.28),inset_0_2px_10px_rgba(255,255,255,0.08)] backdrop-blur-[10px] flex flex-col gap-12"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            {...register("visitName", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
              validate: (v) =>
                v.trim().length > 0 ||
                "Este campo no puede quedar vacío o solo con espacios",
            })}
            autoFocus
            className={`w-full px-16 py-14 rounded-[14px] border bg-[#e2e8f0] text-[#0f172a] text-[0.98rem] outline-none box-border transition-all duration-[250ms] ${errors.visitName ? "border-[#f87171] bg-[#fff7f7] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]" : "border-[#dbe4f0]"}`}
          />
          {errors.visitName && (
            <p className="-mt-4 mb-2 ml-4 text-[0.85rem] text-[#dc2626] font-medium">
              {getErrorMessage(errors.visitName.message)}
            </p>
          )}

          <input
            type="text"
            placeholder="DUI (formato 8 dígitos-1 dígito, ej. 01234567-8)"
            {...register("dui", {
              required: "El DUI es obligatorio",
              pattern: {
                value: /^\d{8}-\d{1}$/,
                message:
                  "Formato inválido. Ejemplo: 01234567-8",
              },
            })}
            className={`w-full px-16 py-14 rounded-[14px] border bg-[#e2e8f0] text-[#0f172a] text-[0.98rem] outline-none box-border transition-all duration-[250ms] ${errors.dui ? "border-[#f87171] bg-[#fff7f7] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]" : "border-[#dbe4f0]"}`}
          />
          {errors.dui && (
            <p className="-mt-4 mb-2 ml-4 text-[0.85rem] text-[#dc2626] font-medium">
              {getErrorMessage(errors.dui.message)}
            </p>
          )}

          <input
            type="text"
            placeholder="Número de placa (ej. P123-456 o ABC1234)"
            {...register("numPlaca", {
              required: "La placa es obligatoria",
              pattern: {
                value:
                  /^[A-Z]{1,3}\d{2,4}(-?\d{2,4})?$/i,
                message:
                  "Formato de placa inválido",
              },
            })}
            className={`w-full px-16 py-14 rounded-[14px] border bg-[#e2e8f0] text-[#0f172a] text-[0.98rem] outline-none box-border transition-all duration-[250ms] ${errors.numPlaca ? "border-[#f87171] bg-[#fff7f7] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]" : "border-[#dbe4f0]"}`}
          />
          {errors.numPlaca && (
            <p className="-mt-4 mb-2 ml-4 text-[0.85rem] text-[#dc2626] font-medium">
              {getErrorMessage(errors.numPlaca.message)}
            </p>
          )}

          <input
            type="number"
            placeholder="Casa a visitar"
            {...register("visitHouse", {
              required:
                "La casa a visitar es obligatoria",
              valueAsNumber: true,
              min: {
                value: 1,
                message:
                  "Debe ser un número positivo",
              },
              validate: (v) =>
                Number.isInteger(v) ||
                "Debe ser un número entero válido",
            })}
            className={`w-full px-16 py-14 rounded-[14px] border bg-[#e2e8f0] text-[#0f172a] text-[0.98rem] outline-none box-border transition-all duration-[250ms] ${errors.visitHouse ? "border-[#f87171] bg-[#fff7f7] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]" : "border-[#dbe4f0]"}`}
          />
          {errors.visitHouse && (
            <p className="-mt-4 mb-2 ml-4 text-[0.85rem] text-[#dc2626] font-medium">
              {getErrorMessage(errors.visitHouse.message)}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 px-18 py-14 border-none rounded-[14px] bg-[#1e293b]/[0.92] text-white text-[1rem] font-semibold cursor-pointer transition-all duration-[250ms] shadow-[0_8px_18px_rgba(79,70,229,0.28)] ${isSubmitting ? "opacity-70 cursor-not-allowed shadow-none" : ""}`}
          >
            {isSubmitting
              ? "Guardando..."
              : "Registrar visita"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-[1000px] mt-10">
        <h3 className="text-[2rem] font-bold tracking-wide mt-34 mb-22 text-[#c7d2fe] text-center [text-shadow:0_4px_18px_rgba(99,102,241,0.18)]">
          Historial de visitas
        </h3>

        {visits.map((visit, index) => (
          <VisitCard
            visit={visit}
            key={
              visit._id ??
              `${visit.visitName}-${visit.dui}-${index}`
            }
          />
        ))}
      </div>
    </div>
  );
}