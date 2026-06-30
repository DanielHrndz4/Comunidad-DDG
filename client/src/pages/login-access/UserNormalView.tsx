import { useEffect } from "react";

import UserNormalTable from "../../components/tables/UserNormalTable";
import { useAuth } from "../../context/AuthContext";

export default function UserNormalView() {
  const { getAllUsers, users } = useAuth();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1120px] space-y-8">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Directorio de Usuarios</h1>
          <p className="mt-3 text-sm text-[#9ca3af]">Visualiza la información de los miembros de tu comunidad.</p>
        </header>

        <UserNormalTable users={users} />
      </div>
    </div>
  );
}
