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

const styles = {
  page: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "28px 16px 40px",
  },

  formWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },

  title: {
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "0.3px",
    marginBottom: "20px",
    color: "#c7d2fe",
    textAlign: "center" as const,
    textShadow: "0 4px 18px rgba(99, 102, 241, 0.18)",
  },

  historyTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "0.3px",
    marginTop: "34px",
    marginBottom: "22px",
    color: "#c7d2fe",
    textAlign: "center" as const,
    textShadow: "0 4px 18px rgba(99, 102, 241, 0.18)",
  },

  formCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "28px 24px",
    borderRadius: "22px",
    background: "rgba(229, 231, 235, 0.92)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.28), 0 2px 10px rgba(255, 255, 255, 0.08) inset",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe4f0",
    background: "#e2e8f0",
    color: "#0f172a",
    fontSize: "0.98rem",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "all 0.25s ease",
  },

  inputError: {
    border: "1px solid #f87171",
    background: "#fff7f7",
    boxShadow: "0 0 0 3px rgba(248, 113, 113, 0.12)",
  },

  errorText: {
    margin: "-4px 0 2px 4px",
    fontSize: "0.85rem",
    color: "#dc2626",
    fontWeight: 500,
  },

  button: {
    width: "100%",
    marginTop: "8px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(30, 41, 59, 0.92)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 18px rgba(79, 70, 229, 0.28)",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  historyContainer: {
    width: "100%",
    maxWidth: "1000px",
    marginTop: "10px",
  },
};

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
    <div style={styles.page}>
      <div style={styles.formWrapper}>
        <h3 style={styles.title}>Registro de visitas</h3>

        <form onSubmit={onSubmit} style={styles.formCard}>
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
            style={{
              ...styles.input,
              ...(errors.visitName ? styles.inputError : {}),
            }}
          />
          {errors.visitName && (
            <p style={styles.errorText}>
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
            style={{
              ...styles.input,
              ...(errors.dui ? styles.inputError : {}),
            }}
          />
          {errors.dui && (
            <p style={styles.errorText}>
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
            style={{
              ...styles.input,
              ...(errors.numPlaca ? styles.inputError : {}),
            }}
          />
          {errors.numPlaca && (
            <p style={styles.errorText}>
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
            style={{
              ...styles.input,
              ...(errors.visitHouse ? styles.inputError : {}),
            }}
          />
          {errors.visitHouse && (
            <p style={styles.errorText}>
              {getErrorMessage(errors.visitHouse.message)}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
          >
            {isSubmitting
              ? "Guardando..."
              : "Registrar visita"}
          </button>
        </form>
      </div>

      <div style={styles.historyContainer}>
        <h3 style={styles.historyTitle}>
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