import { useForm } from "react-hook-form";

import { useAuth } from "../../context/AuthContext";

import { useEffect, useState } from "react";

import assets from "../../assets";

import type {
    AuthModalProps,
    RegisterFormData,
    RegisterPayload,
} from "../../interfaces/IAuthForms";

import "./Register.css";

function Register({
    onClose,
}: AuthModalProps) {

    const [
        mostrarPassword,
        setMostrarPassword,
    ] = useState<boolean>(false);

    const [
        verPassword,
        setVerPassword,
    ] = useState<boolean>(false);

    const [
        verConfirmPassword,
        setVerConfirmPassword,
    ] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const {
        signup,
        errors: registerErrors,
    } = useAuth();

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string>("");

    const [
        submitted,
        setSubmitted,
    ] = useState<boolean>(false);

    useEffect(() => {

        if (submitted) {

            if (
                registerErrors.length === 0
            ) {

                setSuccessMessage(
                    "¡Cuenta creada con éxito!"
                );

                const timer =
                    setTimeout(() => {

                        setSuccessMessage("");

                        onClose();

                    }, 3000);

                return () =>
                    clearTimeout(timer);
            }

            setSubmitted(false);
        }

    }, [
        registerErrors,
        submitted,
        onClose,
    ]);

    const onSubmit = handleSubmit(
        async (
            values: RegisterFormData
        ) => {

            if (!mostrarPassword) {

                setMostrarPassword(true);

                return;
            }

            if (
                values.password !==
                values.confirmPassword
            ) {

                alert(
                    "Las contraseñas no coinciden."
                );

                return;
            }

            try {

                const userData: RegisterPayload = {
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    telephone: values.telephone,
                    age: values.age,
                    role: values.role,
                    password: values.password,
                };

                await signup(userData);

                setSubmitted(true);

            } catch (error) {

                console.log(error);
            }
        }
    );

    function closeForm(): void {
        onClose();
    }

    return (

        <div className="register-modal-overlay">

            <div className="register-modal">

                {mostrarPassword && (

                    <button
                        className="register-back-button"
                        onClick={() =>
                            setMostrarPassword(false)
                        }
                    >
                        ←
                    </button>

                )}

                <h2 className="register-title">
                    Crea tu cuenta
                </h2>

                <form
                    onSubmit={onSubmit}
                    className="register-form"
                >

                    <input
                        type="text"
                        {...register(
                            "name",
                            {
                                required: true,
                            }
                        )}
                        className="register-input"
                        placeholder="Ingrese su nombre"
                    />

                    {errors.name && (
                        <p className="register-error-text">
                            El nombre es requerido
                        </p>
                    )}

                    <input
                        type="text"
                        {...register(
                            "username",
                            {
                                required: true,
                            }
                        )}
                        className="register-input"
                        placeholder="Ingrese un usuario"
                    />

                    {errors.username && (
                        <p className="register-error-text">
                            El usuario es requerido
                        </p>
                    )}

                    <input
                        type="email"
                        {...register(
                            "email",
                            {
                                required: true,
                            }
                        )}
                        className="register-input"
                        placeholder="Ingrese su correo"
                    />

                    {errors.email && (
                        <p className="register-error-text">
                            El correo es requerido
                        </p>
                    )}

                    <input
                        type="text"
                        {...register(
                            "telephone",
                            {
                                required: true,
                            }
                        )}
                        className="register-input"
                        placeholder="Ingrese su teléfono"
                    />

                    {errors.telephone && (
                        <p className="register-error-text">
                            El teléfono es requerido
                        </p>
                    )}

                    <input
                        type="number"
                        {...register(
                            "age",
                            {
                                required: true,
                            }
                        )}
                        className="register-input"
                        placeholder="Ingrese su edad"
                    />

                    {errors.age && (
                        <p className="register-error-text">
                            La edad es requerida
                        </p>
                    )}

                    <input
                        type="hidden"
                        value="user"
                        {...register("role")}
                    />

                    {mostrarPassword && (

                        <>

                            <div className="register-password-container">

                                <input
                                    type={
                                        verPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register(
                                        "password",
                                        {
                                            required: true,
                                        }
                                    )}
                                    placeholder="Clave"
                                    className="register-input"
                                />

                                <img
                                    src={assets.ojo}
                                    alt="Mostrar contraseña"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setVerPassword(
                                            !verPassword
                                        )
                                    }
                                />

                            </div>

                            {errors.password && (
                                <p className="register-error-text">
                                    La contraseña es requerida
                                </p>
                            )}

                            <div className="register-password-container">

                                <input
                                    type={
                                        verConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register(
                                        "confirmPassword",
                                        {
                                            required: true,
                                        }
                                    )}
                                    placeholder="Confirmar clave"
                                    className="register-input"
                                />

                                <img
                                    src={assets.ojo}
                                    alt="Mostrar contraseña"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setVerConfirmPassword(
                                            !verConfirmPassword
                                        )
                                    }
                                />

                            </div>

                            {errors.confirmPassword && (
                                <p className="register-error-text">
                                    Debes confirmar la contraseña
                                </p>
                            )}

                        </>

                    )}

                    <button
                        type="submit"
                        className="register-next-button"
                    >
                        {mostrarPassword
                            ? "Registrar"
                            : "Siguiente"}
                    </button>

                </form>

                <button
                    onClick={closeForm}
                    className="register-login-button"
                >
                    ¿Ya tienes cuenta?
                </button>

                <button
                    className="register-cancel-button"
                    onClick={onClose}
                >
                    Cancelar
                </button>

                {registerErrors.map(
                    (
                        error,
                        i
                    ) => (
                        <div
                            key={i}
                            className="register-error"
                        >
                            {error}
                        </div>
                    )
                )}

                {successMessage && (
                    <div className="register-success">
                        {successMessage}
                    </div>
                )}

            </div>

        </div>
    );
}

export default Register;