import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function SecondaryButton({ loading = false, disabled, className, children, ...props }: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-8 border border-white/10 bg-neutral-900 px-20 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:px-24 sm:py-3.5 sm:text-[15px] ${className || ""}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
      <span>{children}</span>
    </button>
  );
}