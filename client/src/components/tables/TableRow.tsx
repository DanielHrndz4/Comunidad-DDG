import type { ReactNode } from "react";

interface TableCardProps {
  children: ReactNode;
}

export default function TableCard({
  children,
}: TableCardProps) {
  return (
    <div
      className="w-[300px] p-6 bg-[#121212] border border-white/10 rounded-2xl
      text-gray-300 text-left duration-300 ease-in-out shadow-lg flex flex-col gap-3
      hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(62,207,142,0.15)] hover:border-[#3ecf8e]/50"
    >
      {children}
    </div>
  );
}