import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useTask } from "../../context/TaskContext";
import VisitCard from "../../components/VisitCard";
import "./Visits.css";

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
    <div>
      <div>
        <h3 className="section-title">
          Registro de visitas
        </h3>

        <form onSubmit={onSubmit}>
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
            className={`input-field ${
              errors.visitName
                ? "input-error"
                : ""
            }`}
          />
          {errors.visitName && (
            <p className="error-text">
              {getErrorMessage(
                errors.visitName.message
              )}
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
            className={`input-field ${
              errors.dui ? "input-error" : ""
            }`}
          />
          {errors.dui && (
            <p className="error-text">
              {getErrorMessage(
                errors.dui.message
              )}
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
            className={`input-field ${
              errors.numPlaca
                ? "input-error"
                : ""
            }`}
          />
          {errors.numPlaca && (
            <p className="error-text">
              {getErrorMessage(
                errors.numPlaca.message
              )}
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
            className={`input-field ${
              errors.visitHouse
                ? "input-error"
                : ""
            }`}
          />
          {errors.visitHouse && (
            <p className="error-text">
              {getErrorMessage(
                errors.visitHouse.message
              )}
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Guardando..."
              : "Registrar visita"}
          </button>
        </form>
      </div>

      <div className="history-container">
        <h3 className="section-title">
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