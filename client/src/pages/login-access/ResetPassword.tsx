import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

interface ResetPasswordProps {
  onClose: () => void;
}

export default function ResetPassword({ onClose }: ResetPasswordProps) {
  const { requestPasswordReset, confirmPasswordReset, errors: authErrors } = useAuth();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      setLocalErrors(["El correo o usuario es requerido"]);
      return;
    }

    setLoading(true);
    setLocalErrors([]);

    try {
      await requestPasswordReset(emailOrUsername);
      Swal.fire({
        title: "¡Código Enviado!",
        text: "Hemos enviado un código OTP de 6 dígitos a tu correo electrónico registrado.",
        icon: "success",
        confirmButtonColor: "#2dbda1",
      });
      setStep(2);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "No se pudo enviar el código OTP. Verifica que el usuario o correo sea correcto.";
      setLocalErrors([msg]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors([]);

    if (!otp.trim() || otp.length !== 6) {
      setLocalErrors(["El código OTP debe ser de 6 dígitos"]);
      return;
    }

    if (!password.trim() || password.length < 6) {
      setLocalErrors(["La contraseña debe tener al menos 6 caracteres"]);
      return;
    }

    if (password !== confirmPassword) {
      setLocalErrors(["Las contraseñas no coinciden"]);
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset({
        emailOrUsername,
        otp,
        password,
      });

      await Swal.fire({
        title: "¡Contraseña Restablecida!",
        text: "Tu contraseña ha sido cambiada con éxito. Ya puedes iniciar sesión con tu nueva credencial.",
        icon: "success",
        confirmButtonColor: "#2dbda1",
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Error al restablecer la contraseña. Verifica que el código OTP sea correcto o no haya expirado.";
      setLocalErrors([msg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="login-modal-overlay" 
      style={{ zIndex: 10000, display: "flex", justifyContent: "center", alignItems: "center" }}
      onClick={onClose}
    >
      <div 
        className="reset-modal-container"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "36px 32px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 20px 40px rgba(20, 43, 54, 0.15)",
          boxSizing: "border-box",
          position: "relative",
          animation: "scaleIn 0.3s ease-out",
          fontFamily: "'Montserrat', sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#142B36", margin: "0 0 10px 0" }}>
            {step === 1 ? "Recuperar Contraseña" : "Verificar Código"}
          </h2>
          <p style={{ fontSize: "14px", color: "#6e6e73", lineHeight: 1.5, margin: 0 }}>
            {step === 1 
              ? "Ingresa tu usuario o correo electrónico para enviarte un código OTP de verificación." 
              : "Ingresa el código OTP de 6 dígitos que enviamos a tu correo y tu nueva contraseña."}
          </p>
        </div>

        {/* Errors list */}
        {(localErrors.length > 0 || authErrors.length > 0) && (
          <div style={{ 
            backgroundColor: "#fff8f8", 
            borderLeft: "4px solid #e54a55", 
            padding: "12px 16px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            {[...localErrors, ...authErrors].map((err, idx) => (
              <p key={idx} style={{ color: "#e54a55", fontSize: "13px", fontWeight: 600, margin: "2px 0" }}>
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div 
              style={{
                backgroundColor: "#f4f7f6",
                borderRadius: "12px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s"
              }}
              className="reset-input-group"
            >
              <FiMail style={{ color: "#8fa09b", marginRight: "12px", fontSize: "18px", flexShrink: 0 }} />
              <input 
                type="text" 
                placeholder="Usuario o Correo electrónico"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#142B36"
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #2dbda1, #1a9e86)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                height: "50px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                boxShadow: "0 4px 14px rgba(45, 189, 161, 0.3)",
                marginTop: "10px"
              }}
            >
              {loading ? "Enviando..." : "Enviar Código OTP"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                color: "#8c92ac",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px",
                marginTop: "4px"
              }}
            >
              Cancelar
            </button>
          </form>
        ) : (
          /* Step 2: Confirm OTP & New Password */
          <form onSubmit={handleConfirmReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* OTP code */}
            <div 
              style={{
                backgroundColor: "#f4f7f6",
                borderRadius: "12px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s"
              }}
              className="reset-input-group"
            >
              <FiKey style={{ color: "#8fa09b", marginRight: "12px", fontSize: "18px", flexShrink: 0 }} />
              <input 
                type="text" 
                maxLength={6}
                placeholder="Código OTP (6 dígitos)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#142B36",
                  letterSpacing: "4px"
                }}
                disabled={loading}
              />
            </div>

            {/* New Password */}
            <div 
              style={{
                backgroundColor: "#f4f7f6",
                borderRadius: "12px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s",
                position: "relative"
              }}
              className="reset-input-group"
            >
              <FiLock style={{ color: "#8fa09b", marginRight: "12px", fontSize: "18px", flexShrink: 0 }} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#142B36",
                  paddingRight: "35px"
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8fa09b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  zIndex: 2
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div 
              style={{
                backgroundColor: "#f4f7f6",
                borderRadius: "12px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s",
                position: "relative"
              }}
              className="reset-input-group"
            >
              <FiLock style={{ color: "#8fa09b", marginRight: "12px", fontSize: "18px", flexShrink: 0 }} />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Nueva Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#142B36",
                  paddingRight: "35px"
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8fa09b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  zIndex: 2
                }}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #e54a55, #c83741)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                height: "50px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                boxShadow: "0 4px 14px rgba(229, 74, 85, 0.3)",
                marginTop: "10px"
              }}
            >
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setLocalErrors([]);
              }}
              disabled={loading}
              style={{
                background: "transparent",
                color: "#2dbda1",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px",
                marginTop: "4px"
              }}
            >
              <FiArrowLeft size={16} />
              Volver a solicitar código
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .reset-input-group:focus-within {
          border-color: #2dbda1 !important;
        }
      `}</style>
    </div>
  );
}