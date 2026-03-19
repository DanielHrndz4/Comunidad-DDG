// Importamos useForm de react-hook-form para manejar formularios de manera sencilla y validaciones
import { useForm } from "react-hook-form";
// Importamos useEffect y useState de React
import { useEffect, useState } from "react";
// Importamos funciones del contexto TaskContext para manejar visitas
import { useTask } from "../../context/TaskContext";
// Importamos funciones del contexto AuthContext para autenticación (logout)
import { useAuth } from "../../context/AuthContext";
// Componente que representa cada tarjeta de visita en el historial
import VisitCard from "../../components/VisitCard";
// Importamos Link y useNavigate para navegación programática
import { Link, useNavigate } from "react-router";
// Librería SweetAlert2 para mostrar alertas bonitas
import Swal from "sweetalert2";
// Importamos assets, probablemente imágenes o íconos
import assets from "../../../src/assets";
// Importamos CSS específico para esta vista
import "./Visits.css";

// Componente funcional Visits, encargado de registrar y mostrar visitas
export default function Visits() {
    // Configuración del formulario usando react-hook-form
    const {
        register, // para registrar inputs
        handleSubmit, // función para manejar submit
        formState: { errors, isSubmitting }, // estados de errores y envío
        setValue, // permite actualizar valores del formulario programáticamente
    } = useForm({
        defaultValues: { // valores iniciales del formulario
            visitName: "",
            dui: "",
            numPlaca: "",
            visitHouse: "",
        },
        mode: "onSubmit", // validación al enviar el formulario
    });

    // Extraemos funciones del contexto de tareas
    const { createVisitVigilant, getVisitVigilant, addVisit } = useTask();
    // Extraemos función logout del contexto de autenticación
    const { logout } = useAuth();

    const navigate = useNavigate(); // para redirecciones
    const [isMenuOpen, setIsMenuOpen] = useState(false); // estado de menú desplegable (si existiera)

    // useEffect para cargar las visitas al montar el componente
    useEffect(() => {
        getVisitVigilant();
    }, [getVisitVigilant]);

    // Función que limpia espacios en los datos del formulario antes de enviarlos
    const preSubmitTrim = (data) => {
        const cleaned = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
        );
        // Reinyecta los valores limpios al form (opcional)
        Object.entries(cleaned).forEach(([k, v]) => setValue(k, v, { shouldValidate: true }));
        return cleaned;
    };

    // Función que se ejecuta si el formulario es válido
    const onValid = handleSubmit(async (data) => {
        const payload = preSubmitTrim(data);

        try {
            // Intentamos crear la visita usando la función del contexto
            await createVisitVigilant(payload);
            // Mostramos alerta de éxito
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
            }).then(() => navigate("/vigilant")); // Redirigimos a la página principal de vigilante
        } catch (error) {
            // En caso de error mostramos alerta de fallo
            Swal.fire({
                title: "Error",
                text: "No se pudo crear la visita.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    });

    // Función que se ejecuta si el formulario tiene errores de validación
    const onInvalid = (formErrors) => {
        const areAllEmpty =
            !formErrors.visitName && !formErrors.dui && !formErrors.numPlaca && !formErrors.visitHouse;
        // Mostramos alerta indicando campos incompletos
        Swal.fire({
            title: "Campos incompletos",
            text: "Revisa los campos resaltados e inténtalo de nuevo.",
            icon: "warning",
            confirmButtonColor: "#f59e0b",
        });
    };

    // Función para alternar el menú desplegable
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div>
            <div>
                <h3 className="section-title">Registro de visitas</h3>

                {/* Formulario para registrar visitas */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onValid, onInvalid)(); // Ejecuta la validación
                }}>
                    {/* Input para nombre de visitante */}
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        {...register("visitName", {
                            required: "El nombre es obligatorio",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            validate: (v) =>
                                v.trim().length > 0 || "Este campo no puede quedar vacío o solo con espacios",
                        })}
                        autoFocus
                        className={`input-field ${errors.visitName ? "input-error" : ""}`}
                    />
                    {errors.visitName && <p className="error-text">{errors.visitName.message}</p>}

                    {/* Input para DUI */}
                    <input
                        type="text"
                        placeholder="DUI (formato 8 dígitos-1 dígito, ej. 01234567-8)"
                        {...register("dui", {
                            required: "El DUI es obligatorio",
                            pattern: {
                                value: /^\d{8}-\d{1}$/,
                                message: "Formato inválido. Ejemplo: 01234567-8",
                            },
                        })}
                        className={`input-field ${errors.dui ? "input-error" : ""}`}
                    />
                    {errors.dui && <p className="error-text">{errors.dui.message}</p>}

                    {/* Input para número de placa */}
                    <input
                        type="text"
                        placeholder="Número de placa (ej. P123-456 o ABC1234)"
                        {...register("numPlaca", {
                            required: "La placa es obligatoria",
                            pattern: {
                                value: /^[A-Z]{1,3}\d{2,4}(-?\d{2,4})?$/i,
                                message: "Formato de placa inválido",
                            },
                        })}
                        className={`input-field ${errors.numPlaca ? "input-error" : ""}`}
                    />
                    {errors.numPlaca && <p className="error-text">{errors.numPlaca.message}</p>}

                    {/* Input para número de casa */}
                    <input
                        type="number"
                        placeholder="Casa a visitar"
                        {...register("visitHouse", {
                            required: "La casa a visitar es obligatoria",
                            valueAsNumber: true, // convierte a número
                            min: { value: 1, message: "Debe ser un número positivo" },
                            validate: (v) => Number.isInteger(v) || "Debe ser un número entero válido",
                        })}
                        className={`input-field ${errors.visitHouse ? "input-error" : ""}`}
                    />
                    {errors.visitHouse && <p className="error-text">{errors.visitHouse.message}</p>}

                    {/* Botón de submit */}
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Registrar visita"}
                    </button>
                </form>
            </div>

            {/* Sección de historial de visitas */}
            <div className="history-container">
                <h3 className="section-title">Historial de visitas</h3>
                {addVisit
                    .slice() // copiamos el array para no mutar el original
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // orden descendente por fecha
                    .map((visit) => (
                        <VisitCard visit={visit} key={visit._id} /> // renderizamos cada visita como tarjeta
                    ))}
            </div>
        </div>
    );
}
