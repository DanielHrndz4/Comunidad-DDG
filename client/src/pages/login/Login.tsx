import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import {
    useNavigate,
    Link,
} from "react-router";
import { useEffect, useState } from "react";

import ResetPassword from "../login-access/ResetPassword";

import type {
    AuthModalProps,
    LoginFormData,
} from "../../interfaces/IAuthForms";

import "./Login.css";

function Login({
    onClose,
}: AuthModalProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const {
        signin,
        errors: signinErrorsRaw,
        isAuthenticate,
        user,
    } = useAuth();

    const [
        showResetPassword,
        setReserPasswordModal,
    ] = useState<boolean>(false);

    const navigate = useNavigate();

    const signinErrors =
        Array.isArray(signinErrorsRaw)
            ? signinErrorsRaw
            : signinErrorsRaw
                ? [signinErrorsRaw]
                : [];

    const handleReserPasswordClick =
        (): void => {
            setReserPasswordModal(true);
        };

    const handleCloseReserPasswordClick =
        (): void => {
            setReserPasswordModal(false);
            onClose();
        };

    const onSubmit = handleSubmit(
        async (
            data: LoginFormData
        ) => {
            await signin(data);
        }
    );

    useEffect(() => {

        if (
            isAuthenticate &&
            user?.role
        ) {

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

    }, [
        isAuthenticate,
        user,
        navigate,
    ]);

    function closeForm(): void {
        onClose();
    }

    return (

        <div className="login-modal-overlay">

            <div className="login-modal">

                <h2 className="login-title">
                    Inicio de sesión
                </h2>

                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {signinErrors.map(
                    (
                        error,
                        i
                    ) => (
                        <div
                            className="login-error"
                            key={i}
                        >
                            {
                                typeof error === "string"
                                    ? error
                                    : "Error de autenticación"
                            }
                        </div>
                    )
                )}

                <form
                    onSubmit={onSubmit}
                    className="login-form"
                >

                    <input
                        type="text"
                        {...register(
                            "username",
                            {
                                required: true,
                            }
                        )}
                        className="login-input"
                        placeholder="Usuario"
                    />

                    {errors.username && (
                        <p className="login-error-text">
                            El usuario es requerido
                        </p>
                    )}

                    <input
                        type="password"
                        {...register(
                            "password",
                            {
                                required: true,
                            }
                        )}
                        className="login-input"
                        placeholder="Contraseña"
                    />

                    {errors.password && (
                        <p className="login-error-text">
                            La contraseña es requerida
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Iniciar sesión
                    </button>

                </form>

                <p className="login-support-text">

                    ¿Olvidaste tu clave?

                    <Link
                        to="/"
                        className="login-register-link"
                        onClick={
                            handleReserPasswordClick
                        }
                    >
                        Cambiar clave
                    </Link>

                </p>

                <p
                    onClick={closeForm}
                    className="login-support-text login-clickable"
                >
                    ¿No tienes cuenta?
                    Ve a registrarte
                </p>

                <button
                    className="login-cancel-button"
                    onClick={onClose}
                >
                    Cancelar
                </button>

            </div>

            {showResetPassword && (
                <ResetPassword
                    onClose={
                        handleCloseReserPasswordClick
                    }
                />
            )}

        </div>
    );
}

export default Login;