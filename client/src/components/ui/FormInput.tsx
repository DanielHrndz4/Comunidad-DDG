import { InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export default function FormInput({
  label,
  error,
  success,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2 sm:gap-3">
      <label
        className={`ml-1 text-sm font-medium transition-colors duration-200 sm:text-[15px] ${
          error ? "text-red-500" : success ? "text-emerald-400" : focused ? "text-emerald-400" : "text-gray-400"
        }`}
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          {...props}
          aria-invalid={Boolean(error)}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          className={`w-full touch-manipulation rounded-8 border px-4 py-3 text-sm text-white outline-none box-border transition-all duration-200 sm:px-4 sm:py-3.5 sm:text-[15px] ${
            error
              ? "border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/10"
              : success
              ? "border-emerald-400 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-400/20"
              : focused
              ? "border-emerald-400 bg-neutral-800 ring-2 ring-emerald-400/10"
              : "border-white/10 bg-neutral-800"
          }`}
        />
        {error && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 sm:right-4">✕</span>}
        {success && !error && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 sm:right-4">✓</span>}
      </div>
      {error && <p className="m-0 ml-1 text-xs text-red-500 sm:text-sm">{error}</p>}
    </div>
  );
}