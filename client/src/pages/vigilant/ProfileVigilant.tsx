import { useState } from "react";
import Popup from "reactjs-popup";

import { useAuth } from "../../context/AuthContext";
import assets from "../../assets";
import UpdateVigilantForm from "../../components/forms/UpdateVigilantForm";

export default function ProfileVigilant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 py-10">
        <p className="text-sm text-[#9ca3af]">Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white px-6 py-10">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10 lg:flex-row lg:items-start">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9e6e] text-4xl font-bold text-[#050505] shadow-[0_12px_30px_rgba(62,207,142,0.35)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Vigilante</h2>
              <p className="mt-2 text-sm text-[#9ca3af]">Perfil del usuario vigilante</p>
            </div>
            <button
              onClick={openPopup}
              className="rounded-full bg-[#3ecf8e] px-6 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
            >
              Editar Perfil
            </button>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
          <div className="grid gap-6">
            {[
              { label: "Nombre", value: user.name },
              { label: "Email", value: user.email },
              { label: "Edad", value: user.age },
              { label: "Contacto", value: user.telephone },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-[#0f172a] p-6"
              >
                <h3 className="mb-3 text-lg font-semibold text-white">{item.label}:</h3>
                <p className="text-[#d1d5db]">{item.value || "—"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Popup
        open={isOpen}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayClassName="bg-black/50"
        contentClassName="max-h-[95vh] overflow-auto"
      >
        <UpdateVigilantForm user={user} close={closePopup} />
      </Popup>
    </main>
  );
}
