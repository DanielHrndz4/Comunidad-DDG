import { useEffect } from "react";

import UserNormalTable from "../../components/tables/UserNormalTable";
import { useAuth } from "../../context/AuthContext";

export default function UserNormalView() {
  const { getAllUsers, users } = useAuth();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="flex grow-1 flex-col justify-start items-center p-16 w-full box-border">
      <div className="flex justify-center items-center my-16 mx-auto p-16 bg-dark-green w-3/5 rounded-lg shadow-md">
        <h2
          style={{ color: "white" }}
          className="font-sans text-[1.75rem] font-bold text-white m-0 text-center"
        >
          Lista de usuarios
        </h2>
      </div>

      <UserNormalTable users={users} />
    </div>
  );
}