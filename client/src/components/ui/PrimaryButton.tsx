import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function PrimaryButton({ loading = false, disabled, className, children, ...props }: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-8 border-none bg-emerald-400 px-20 py-3 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-500/40 disabled:text-neutral-500 sm:px-24 sm:py-3.5 sm:text-[15px] ${className || ""}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-950/20 border-t-neutral-950" />}
      <span>{children}</span>
    </button>
  );
}