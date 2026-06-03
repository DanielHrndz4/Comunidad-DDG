import { useEffect } from "react";

import UserNormalTable from "../../components/tables/UserNormalTable";
import { useAuth } from "../../context/AuthContext";

export default function UserNormalView() {
  const { getAllUsers, users } = useAuth();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="flex grow flex-col justify-start items-center w-full min-h-screen bg-transparent p-10 box-border">
      
      {/* HEADER TIPO BENTO */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Directorio de Usuarios</h1>
          <p style={{ fontSize: "16px", color: "#9ca3af", margin: 0 }}>Visualiza la información de los miembros de tu comunidad.</p>
        </div>
      </div>

      <UserNormalTable users={users} />
    </div>
  );
}