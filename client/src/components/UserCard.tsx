interface UserItem {
  name: string;
  email: string;
}

interface UserCardProps {
  usr: UserItem;
}

export default function UserCard({ usr }: UserCardProps) {
  return (
    <article className="card-panel w-full flex flex-col justify-center items-center text-center cursor-pointer hover:-translate-y-1 transition-transform duration-300">
      <div className="mb-6 rounded-full bg-white/10 px-6 py-4 text-3xl font-bold text-white">{usr.name.charAt(0).toUpperCase()}</div>
      <h2 className="font-display text-2xl font-bold text-white mb-3">{usr.name}</h2>
      <p className="text-sm text-slate-400">{usr.email}</p>
    </article>
  );
}
