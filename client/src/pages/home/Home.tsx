import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-transparent">
      <div className="w-full max-w-500 flex flex-col items-center p-40 bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-24 shadow-2xl">
        <h1 className="font-display text-48 md:text-56 font-extrabold text-center leading-tight mb-32 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight filter drop-shadow-[0_0_20px_rgba(129,140,248,0.2)]">
          Comunidad de Servicio DDG
        </h1>

        <div className="w-full flex flex-col items-center gap-16">
          <button
            className="w-full flex justify-center items-center px-24 py-16 text-18 font-bold rounded-14 cursor-pointer text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-97 hover:shadow-[0_15px_25px_-5px_rgba(99,102,241,0.5)] hover:brightness-110 border-none"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>

          <p className="my-24 text-12 text-gray-400 text-center tracking-widest uppercase font-semibold">
            ¿Ya tienes una cuenta?
          </p>

          <button
            className="w-full flex justify-center items-center px-24 py-16 text-18 font-bold rounded-14 cursor-pointer text-white bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-97"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}