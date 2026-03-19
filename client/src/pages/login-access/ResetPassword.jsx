import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

function ResetPassword({ onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { updatePasswordByPassword, errors: updateErrors } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updatePasswordByPassword(data);
            onClose();
        } catch (err) {
            console.error("Error al actualizar la contraseña:", err);
          }  
    });

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                <h2 className="login-title">Restablecer contraseña</h2>
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>
                {
                    updateErrors.map((error, i) => (
                        <div className="login-error" key={i}>
                            {error}
                        </div>
                    ))
                }
                <form onSubmit={onSubmit} className="login-form">
                    <input
                         style={{ color: "white" }} 
                        type="text"
                        {...register("username", { required: true })}
                        className="login-input"
                        placeholder="Usuario"
                    />
                    {
                        errors.username && (
                            <p className="login-error-text">El usuario es requerido</p>
                        )
                    }
                    <input
                        style={{ color: "white" }} 
                        type="password"
                        {...register("password", { required: true })}
                        className="login-input"
                        placeholder="Contraseña nueva"
                    />
                    {
                        errors.newPassword && (
                            <p className="login-error-text">La contraseña nueva es requerida</p>
                        )
                    }
                    <button style={{ color: "white" }}  type="submit" className="login-button">Aceptar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
