import { TextareaHTMLAttributes, useState } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  maxLength?: number;
}

export default function FormTextarea({ label, error, success, maxLength, onFocus, onBlur, onChange, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

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
        <textarea
          {...props}
          aria-invalid={Boolean(error)}
          maxLength={maxLength}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onChange={(e) => { setCharCount(e.target.value.length); onChange?.(e); }}
          className={`w-full min-h-28 touch-manipulation rounded-8 border px-4 py-3 text-sm text-white outline-none box-border resize-none transition-all duration-200 sm:min-h-32 sm:px-4 sm:py-3.5 sm:text-[15px] ${
            error
              ? "border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/10"
              : success
              ? "border-emerald-400 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-400/20"
              : focused
              ? "border-emerald-400 bg-neutral-800 ring-2 ring-emerald-400/10"
              : "border-white/10 bg-neutral-800"
          }`}
        />

        {error && <span className="absolute right-3 top-3 text-red-500 sm:right-4">✕</span>}
        {success && !error && <span className="absolute right-3 top-3 text-emerald-400 sm:right-4">✓</span>}
      </div>

      <div className="flex w-full items-center justify-between gap-3">
        {error ? (
          <p className="m-0 ml-1 text-xs text-red-500 sm:text-sm">{error}</p>
        ) : success ? (
          <p className="m-0 ml-1 text-xs text-emerald-400 sm:text-sm">Perfecto</p>
        ) : <span />}

        {maxLength && (
          <span
            className={`mr-1 text-xs sm:text-sm ${
              charCount >= maxLength ? "text-red-500" : charCount >= maxLength * 0.85 ? "text-amber-400" : "text-gray-400"
            }`}
          >
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}