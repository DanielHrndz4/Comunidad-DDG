// Importa hook de formulario para manejar validaciones y envíos.
import { useForm } from "react-hook-form";

// Importa contexto de autenticación para iniciar sesión.
import { useAuth } from "../../context/AuthContext";

// Hook para navegación programática.
import { useNavigate } from "react-router";

// Link para navegación declarativa.
import { Link } from "react-router";

// Hooks de React para estado y efecto.
import { useEffect, useState } from "react";

// Componente para restablecer contraseña.
import ResetPassword from "../login-access/ResetPassword";

// Estilos específicos del login.
import "./Login.css";

// Componente modal de Login.
function Login({ onClose }) {

    // Configuración de react-hook-form.
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Accede a funciones y datos de autenticación desde AuthContext.
    const { signin, errors: signinErrorsRaw, isAuthenticate, user } = useAuth();

    // Estado para controlar la visibilidad del modal de restablecer contraseña.
    const [showResetPassword, setReserPasswordModal] = useState(false);

    const navigate = useNavigate();

    // Asegura que signinErrors siempre sea un array.
    const signinErrors = Array.isArray(signinErrorsRaw)
        ? signinErrorsRaw
        : (signinErrorsRaw ? [signinErrorsRaw] : []);

    // Función para abrir modal de restablecer contraseña.
    const handleReserPasswordClick = () => {
        setReserPasswordModal(true);
    };

    // Función para cerrar modal de restablecer contraseña y cerrar login.
    const handleCloseReserPasswordClick = () => {
        setReserPasswordModal(false);
        onClose();
    };

    // Manejo del envío del formulario.
    const onSubmit = handleSubmit((data) => {
        signin(data);
    });

    // Efecto para redirigir al usuario según su rol una vez autenticado.
    useEffect(() => {
        if (isAuthenticate && user?.role) {
            switch (user.role) {
                case "admin":
                    navigate("/admin");
                    break;
                case "vigilant":
                    navigate("/vigilant");
                    break;
                default:
                    navigate("/user");
            }
        }
    }, [isAuthenticate, user, navigate]);

    // Función para cerrar el modal
    function closeForm() {
        onClose();
    }

    return (
        // Overlay del modal.
        <div className="login-modal-overlay">
            <div className="login-modal">

                {/* Título del modal */}
                <h2 className="login-title">Inicio de sesión</h2>

                {/* Separadores visuales */}
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {/* Renderizado de errores de inicio de sesión */}
                {signinErrors.map((error, i) => (
                    <div className="login-error" key={i}>
                        {typeof error === "string" ? error : error.message}
                    </div>
                ))}

                {/* Formulario de login */}
                <form onSubmit={onSubmit} className="login-form">
                    <input 
                        style={{ color: "white" }} 
                        type="text" 
                        {...register("username", { required: true })}
                        className="login-input"
                        placeholder="Usuario"
                    />
                    {errors.username && (<p className="login-error-text">El usuario es requerido</p>)}

                    <input 
                        style={{ color: "white" }} 
                        type="password" 
                        {...register("password", { required: true })}
                        className="login-input"
                        placeholder="Contraseña"
                    />
                    {errors.password && (<p className="login-error-text">La contraseña es requerida</p>)}

                    <button style={{ background: "white", color: "black" }} type="submit" className="login-button">
                        Aceptar
                    </button>
                </form>

                {/* Links de soporte y registro */}
                <p style={{ color: "white" }}>
                    ¿Olvidaste tu clave? 
                    <Link to={"/"} style={{ color: "white" }} className="login-register-link" onClick={handleReserPasswordClick}>
                        Cambiar clave
                    </Link>
                </p>
                <p onClick={closeForm} style={{ color: "white", cursor: "pointer" }}>
                    ¿No tienes cuenta? Ve a registrarte  
                </p>

                {/* Botón para cerrar el modal */}
                <button style={{ padding: "8px", cursor: "pointer", color: "gray" }} onClick={onClose}>
                    Cancelar
                </button>
            </div>

            {/* Renderizado condicional del modal de restablecer contraseña */}
            {showResetPassword && <ResetPassword onClose={handleCloseReserPasswordClick} />}
        </div>
    );
}

// Exporta el componente Login como predeterminado.
export default Login;
