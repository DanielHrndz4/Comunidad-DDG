import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        px-7
        py-3
        rounded-full
        bg-[#0071E3]
        text-white
        font-medium
        text-[0.92rem]
        transition-all
        duration-200
        hover:brightness-110
        active:scale-[0.97]
        disabled:opacity-45
        disabled:cursor-not-allowed
        disabled:hover:brightness-100
        ${props.className ?? ""}
      `}
    />
  );
}