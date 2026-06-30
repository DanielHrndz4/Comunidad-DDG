import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

import UserTable from "../../components/tables/UserTable";
import CreateUserForm from "../../components/forms/CreateUserForm";
import { useAuth } from "../../context/AuthContext";
import CreateButton from "../../components/CreateButton";

export default function AdminUserView() {
  const { getAdminUsers, getUsers } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="flex grow flex-col justify-start items-center w-full min-h-screen bg-transparent p-10 box-border">
      
      {/* HEADER */}
      <div className="w-full max-w-[1000px] flex justify-between items-center mt-32 mb-48 flex-wrap gap-20">
        <div className="text-left">
          <h1 className="text-[36px] font-bold text-white m-0 mb-8 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-[16px] text-[#9ca3af] m-0">Administra los miembros y accesos de la comunidad.</p>
        </div>
        
        <button
          type="button"
          onClick={openPopup}
          className="flex items-center gap-8 bg-[#3ecf8e] text-[#050505] px-24 py-12 rounded-lg text-[15px] font-semibold border-none cursor-pointer shadow-[0_4px_14px_rgba(62,207,142,0.4)] transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_6px_20px_rgba(62,207,142,0.6)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crear Usuario
        </button>
      </div>

      <Popup
        open={isOpen}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayClassName="bg-black/70 backdrop-blur-sm"
        contentClassName="!bg-transparent !border-none !p-0 w-full max-w-[600px] max-h-[95vh] overflow-auto"
      >
        <CreateUserForm close={closePopup} />
      </Popup>

      <UserTable users={getAdminUsers} />
    </div>
  );
}