import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FiUser, FiCreditCard, FiHome, FiCheckCircle } from "react-icons/fi";

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
        title: "¡Visita registrada!",
        text: "El registro de la visita se guardó correctamente.",
        icon: "success",
        confirmButtonColor: "#2dbda1",
        confirmButtonText: "Aceptar",
        background: "#ffffff",
        color: "#142B36",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error: unknown) {
      Swal.fire({
        title: "Error",
        text: "No se pudo registrar la visita.",
        icon: "error",
        confirmButtonColor: "#e54a55",
      });
    }
  };

  const onInvalid = (): void => {
    Swal.fire({
      title: "Campos inválidos",
      text: "Por favor revisa el formulario e intenta de nuevo.",
      icon: "warning",
      confirmButtonColor: "#fcc33a",
    });
  };

  const onSubmit = handleSubmit(onValid, onInvalid);

  /**
   * DUI format: XXXXXXXX-X (8 digits + dash + 1 digit)
   * Strips non-digits, inserts dash after position 8, caps at 10 chars.
   */
  const formatDui = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 8) return digits;
    return `${digits.slice(0, 8)}-${digits.slice(8)}`;
  };

  /**
   * Placa SV format: PXXX-XXX
   * Keeps only letters and digits, inserts dash after 4 chars, caps at 8.
   */
  const formatPlaca = (raw: string): string => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
    if (clean.length <= 4) return clean;
    return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  };

  const visits = ((addVisit as VisitItem[]) || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  return (
    <div className="ddg-dash-wrapper">
      {/* Background decorations */}
      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">VIGILANCIA Y CONTROL</p>
          <h1 className="ddg-dash-title">Registro de Visitas</h1>
          <p className="ddg-dash-subtitle">
            Control de accesos y seguridad del condominio en tiempo real
          </p>
        </div>

        {/* Two-column layout */}
        <div className="visits-layout">
          
          {/* Left: Registration Form Card */}
          <div className="visits-card-container">
            <div className="visits-premium-card">
              <h2 className="visits-card-title">Registrar Entrada</h2>
              <p className="visits-card-subtitle">Ingresa los datos del visitante</p>

              <form onSubmit={onSubmit} className="visits-form">
                
                {/* Nombre */}
                <div className="form-group-custom">
                  <label>Nombre Completo</label>
                  <div className="input-with-icon">
                    <FiUser className="field-icon" />
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      {...register("visitName", {
                        required: "El nombre es obligatorio",
                        minLength: {
                          value: 3,
                          message: "Mínimo 3 caracteres",
                        },
                        validate: (v) =>
                          v.trim().length > 0 ||
                          "Este campo no puede quedar vacío",
                      })}
                      className={errors.visitName ? "error-border" : ""}
                    />
                  </div>
                  {errors.visitName && (
                    <span className="error-message">
                      {getErrorMessage(errors.visitName.message)}
                    </span>
                  )}
                </div>

                {/* DUI */}
                <div className="form-group-custom">
                  <label>Documento DUI</label>
                  <div className="input-with-icon">
                    <FiCreditCard className="field-icon" />
                    <input
                      type="text"
                      placeholder="01234567-8"
                      {...register("dui", {
                        required: "El DUI es obligatorio",
                        pattern: {
                          value: /^\d{8}-\d{1}$/,
                          message: "Formato inválido. Ejemplo: 01234567-8",
                        },
                      })}
                      onChange={(e) => {
                        const formatted = formatDui(e.target.value);
                        e.target.value = formatted;
                        setValue("dui", formatted, { shouldValidate: false });
                      }}
                      maxLength={10}
                      className={errors.dui ? "error-border" : ""}
                    />
                  </div>
                  {errors.dui && (
                    <span className="error-message">
                      {getErrorMessage(errors.dui.message)}
                    </span>
                  )}
                </div>

                {/* Placa */}
                <div className="form-group-custom">
                  <label>Número de Placa / Matrícula</label>
                  <div className="input-with-icon">
                    <FiCheckCircle className="field-icon" />
                    <input
                      type="text"
                      placeholder="Ej. P123-456 o ABC1234"
                      {...register("numPlaca", {
                        required: "La placa es obligatoria",
                        pattern: {
                          value: /^[A-Z0-9]{1,4}-[A-Z0-9]{1,3}$/i,
                          message: "Formato de placa inválido. Ejemplo: P123-456",
                        },
                      })}
                      onChange={(e) => {
                        const formatted = formatPlaca(e.target.value);
                        e.target.value = formatted;
                        setValue("numPlaca", formatted, { shouldValidate: false });
                      }}
                      maxLength={8}
                      className={errors.numPlaca ? "error-border" : ""}
                    />
                  </div>
                  {errors.numPlaca && (
                    <span className="error-message">
                      {getErrorMessage(errors.numPlaca.message)}
                    </span>
                  )}
                </div>

                {/* Casa */}
                <div className="form-group-custom">
                  <label>Casa a Visitar</label>
                  <div className="input-with-icon">
                    <FiHome className="field-icon" />
                    <input
                      type="number"
                      placeholder="Ej. 42"
                      {...register("visitHouse", {
                        required: "La casa es obligatoria",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "Debe ser un número positivo",
                        },
                        validate: (v) =>
                          Number.isInteger(v) ||
                          "Debe ser un número entero válido",
                      })}
                      className={errors.visitHouse ? "error-border" : ""}
                    />
                  </div>
                  {errors.visitHouse && (
                    <span className="error-message">
                      {getErrorMessage(errors.visitHouse.message)}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="visits-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Registrar Entrada"}
                </button>
              </form>
            </div>
          </div>

          {/* Right: History Card Grid */}
          <div className="visits-history-section">
            <div className="history-header">
              <h2 className="visits-card-title">Registro Reciente</h2>
              <span className="history-count">
                {visits.length} {visits.length === 1 ? "visita" : "visitas"} en total
              </span>
            </div>

            {visits.length > 0 ? (
              <div className="visits-grid">
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
            ) : (
              <div className="empty-visits-state">
                <FiUser size={48} className="empty-icon" />
                <p className="empty-title">No hay visitas registradas</p>
                <p className="empty-desc">Las entradas de visitantes aparecerán aquí</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}