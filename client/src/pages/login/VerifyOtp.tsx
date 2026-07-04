import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { FiMail, FiX } from "react-icons/fi";
import { verifyOtpRequest } from "../../api/auth";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    // Take only the last digit typed
    const digit = cleanValue.substring(cleanValue.length - 1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next input if available
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // Clear previous input and focus it
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, 6);
    
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || "";
      }
      setOtpDigits(newDigits);

      // Focus the last filled input or the 6th input
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");

    if (fullOtp.length < 6) {
      setError("Por favor ingresa los 6 dígitos del código");
      return;
    }

    if (!email) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyOtpRequest({ email, otp: fullOtp });
      setSuccess("¡Cuenta verificada correctamente! Redirigiendo a Login...");
      setError("");
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al verificar el código OTP");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl w-[850px] max-w-[95%] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-slate-100 relative">
        
        {/* Left panel - Teal background */}
        <div className="md:w-2/5 bg-gradient-to-br from-[#2dbda1] to-[#209f87] p-10 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-white/10 rotate-45 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-full pointer-events-none" />
          
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">
            Código OTP
          </h2>
          <p className="text-sm text-white/90 mb-8 max-w-[200px] leading-relaxed">
            Ingresa el código que enviamos a tu correo para activar tu cuenta.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-8 py-3 border-2 border-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#209f87] transition-all duration-300 cursor-pointer"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Right panel - White form */}
        <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white relative">
          
          {/* Close button */}
          <button
            type="button"
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
            onClick={() => navigate("/")}
          >
            <FiX size={20} />
          </button>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#209f87] tracking-tight">
              Verificar Cuenta
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Activa tu usuario ingresando tus datos
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl text-left mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-100 text-[#209f87] text-sm px-4 py-3 rounded-xl text-center font-semibold mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-6 bg-transparent w-full">
            
            {/* Email input field */}
            <div className="flex flex-col items-start gap-1 w-full">
              <label className="text-xs font-semibold text-slate-400 ml-1">Correo Electrónico</label>
              <div className="relative w-full">
                {/* <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={18} />
                </div> */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-20 pr-4 py-3 bg-[#f4f7f6] text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#209f87]/50 text-sm transition-all border border-transparent placeholder-slate-400"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Premium 6-digit OTP Inputs */}
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-xs font-semibold text-slate-400 ml-1">Código de 6 dígitos</label>
              <div className="flex justify-between gap-2 w-full">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-center text-xl font-bold bg-[#f4f7f6] text-slate-800 rounded-xl border-2 border-transparent focus:border-[#209f87] focus:bg-white focus:outline-none transition-all shadow-sm"
                    required
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 py-3 bg-[#209f87] hover:bg-[#1a8571] text-white font-bold text-sm rounded-full uppercase tracking-wider shadow-lg shadow-[#209f87]/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Verificar Cuenta"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
