import { ButtonHTMLAttributes } from "react";

export default function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        px-7
        py-3
        rounded-full
        bg-[#F5F5F7]
        border
        border-[#D2D2D7]
        text-[#1D1D1F]
        font-medium
        text-[0.92rem]
        transition-all
        duration-200
        hover:bg-[#EBEBED]
        active:scale-[0.97]
        ${props.className ?? ""}
      `}
    />
  );
}