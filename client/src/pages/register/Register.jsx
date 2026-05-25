import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import assets from "../../../src/assets";
import "./Register.css";

function Register({ onClose }) {
    // Estados para mostrar/ocultar contraseña y confirmación
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [verPassword, setVerPassword] = useState(false);
    const [verConfirmPassword, setVerConfirmPassword] = useState(false);

    // Formulario controlado por react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Contexto de autenticación
    const { signup, errors: registerErrors } = useAuth();

    // Estados para manejo de mensajes de éxito
    const [successMessage, setSuccessMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [successMessageStyle, setSuccessMessageStyle] = useState({});

    // Efecto para mostrar mensaje de éxito y cerrar modal automáticamente
    useEffect(() => {
        if (submitted) {
            if (registerErrors.length === 0) {
                setSuccessMessage("¡Cuenta creada con éxito!");
                setSuccessMessageStyle({
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                });
                const timer = setTimeout(() => {
                    setSuccessMessage("");
                    onClose();
                }, 5000);
                return () => clearTimeout(timer);
            }
            setSubmitted(false);
        }
    }, [registerErrors, submitted, onClose]);

    // Función que se ejecuta al enviar el formulario
    const onSubmit = handleSubmit(async (values) => {
        if (!mostrarPassword) {
            // Primer paso: mostrar campos de contraseña
            setMostrarPassword(true);
        } else {
            // Validar coincidencia de contraseña
            if (values.password !== values.confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }
            try {
                // Preparar payload con datos del formulario
                const payload = {
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    telephone: values.telephone,
                    age: values.age,
                    role: values.role,
                    password: values.password,
                };
                // Llamar a la función de registro del contexto
                await signup(payload);
                setSubmitted(true);
            } catch (error) {
                console.error("Error al crear cuenta:", error);
            }
        }
    });

    // Función para cerrar el modal
    function closeForm() {
        onClose();
    }

    return (
        <div className="register-modal-overlay">
            <div className="register-modal">
                {/* Botón para regresar al paso anterior */}
                {mostrarPassword && (
                    <button
                        className="register-back-button"
                        onClick={() => setMostrarPassword(false)}
                    >
                    </button>
                )}

                {/* Título del modal */}
                <h2 style={{ color: "white" }} className="register-title">Crea tu cuenta</h2>

                {/* Formulario de registro */}
                <form onSubmit={onSubmit} className="register-form">
                    {/* Campos de datos personales */}
                    <input
                        style={{ color: "white" }}
                        type="text"
                        {...register("name", { required: true })}
                        className="register-input"
                        placeholder="Ingrese su nombre"
                    />
                    {errors.name && <p className="register-error-text">El nombre es requerido</p>}

                    <input
                        style={{ color: "white" }}
                        type="text"
                        {...register("username", { required: true })}
                        className="register-input"
                        placeholder="Ingrese un usuario"
                    />
                    {errors.username && <p className="register-error-text">El usuario es requerido</p>}

                    <input
                        style={{ color: "white" }}
                        type="email"
                        {...register("email", { required: true })}
                        className="register-input"
                        placeholder="Ingrese su correo"
                    />
                    {errors.email && <p className="register-error-text">El email es requerido</p>}

                    <input
                        style={{ color: "white" }}
                        type="telephone"
                        {...register("telephone", { required: true })}
                        className="register-input"
                        placeholder="Ingrese su teléfono"
                    />
                    {errors.telephone && <p className="register-error-text">El teléfono es requerido</p>}

                    <input
                        style={{ color: "white" }}
                        type="number"
                        {...register("age", { required: true })}
                        className="register-input"
                        placeholder="Ingrese su edad"
                        min="0"
                        step="1"
                    />
                    {errors.age && <p className="register-error-text">La edad es requerida</p>}

                    {/* Campos de contraseña, visibles solo después del primer paso */}
                    {mostrarPassword && (
                        <div>
                            <div className="register-password-container">
                                <input
                                    style={{ color: "white" }}
                                    type={verPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    placeholder="Clave"
                                    className="register-input"
                                />
                                <img
                                    src={assets.ojo}
                                    alt="Mostrar contraseña"
                                    className="register-password-toggle"
                                    onClick={() => setVerPassword(!verPassword)}
                                />
                                {errors.password && <p className="register-error-text">La contraseña es requerida</p>}
                            </div>
                            <div className="register-password-container">
                                <input
                                    style={{ color: "white" }}
                                    type={verConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", { required: true })}
                                    placeholder="Confirmar clave"
                                    className="register-input"
                                />
                                <img
                                    src={assets.ojo}
                                    alt="Mostrar confirmación"
                                    className="register-password-toggle"
                                    onClick={() => setVerConfirmPassword(!verConfirmPassword)}
                                />
                                {errors.confirmPassword && (
                                    <p className="register-error-text">La confirmación de la contraseña es requerida</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botón de siguiente / registrar */}
                    <button
                        style={{ background: "white", color: "black", padding: "6px" }}
                        type="submit"
                        className="register-next-button"
                    >
                        {mostrarPassword ? "Registrar" : "Siguiente"}
                    </button>
                </form>

                {/* Opciones para cerrar o volver al login */}
                <button onClick={closeForm} style={{ color: "white", cursor: "pointer" }}>
                    ¿Ya tienes cuenta? Regresa al inicio de sesión
                </button>
                <button style={{ padding: "8px", cursor: "pointer", color: "gray" }} onClick={onClose}>
                    Cancelar
                </button>

                {/* Mensajes de error y éxito */}
                <br />
                {registerErrors.map((error, i) => (
                    <div key={i} className="register-error">{error}</div>
                ))}
                {successMessage && (
                    <div style={successMessageStyle}>{successMessage}</div>
                )}
            </div>
        </div>
    );
}

export default Register;
