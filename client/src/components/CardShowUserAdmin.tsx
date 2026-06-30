import { MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

interface UserCardAdminProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function CardShowUserAdmin({ user }: UserCardAdminProps) {
  const { deleteUser } = useAuth();

  return (
    <article className="w-full max-w-sm rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-panel">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">{user.name}</h2>
        <p className="mt-2 text-sm text-slate-400">{user.email}</p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
        onClick={() => deleteUser(user.id)}
      >
        <MdDelete /> Eliminar
      </button>
    </article>
  );
}
