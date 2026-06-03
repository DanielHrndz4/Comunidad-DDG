import "./UserCard.css";

interface UserItem {
  name: string;
  email: string;
}

interface UserCardProps {
  usr: UserItem;
}

export default function UserCard({
  usr,
}: UserCardProps) {
  return (
    <div className="w-full">
      <div className="bg-white/5 p-6 rounded-2xl w-full flex flex-col justify-center items-center text-center duration-300 ease-in-out cursor-pointer border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:-translate-y-1 hover:bg-white/10 hover:border-white/20">
        <h2 className="text-[1.5rem] text-gray-100 font-bold mb-2">
          {usr.name}
        </h2>

        <p className="text-[1rem] text-gray-400 font-medium">
          {usr.email}
        </p>
      </div>
    </div>
  );
}