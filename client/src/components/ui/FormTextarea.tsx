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

  const borderColor = error
    ? "border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]/10"
    : success
    ? "border-[#34C759] focus:border-[#34C759] focus:ring-[#34C759]/10"
    : "border-[#D2D2D7] focus:border-[#0071E3] focus:ring-[#0071E3]/10";

  const bgColor = error
    ? "bg-[#FFF5F5]"
    : success
    ? "bg-[#F5FFF8]"
    : focused
    ? "bg-white"
    : "bg-[#F5F5F7]";

  const labelColor = error
    ? "text-[#FF3B30]"
    : success
    ? "text-[#34C759]"
    : focused
    ? "text-[#0071E3]"
    : "text-[#6E6E73]";

  const charCountColor = maxLength
    ? charCount >= maxLength
      ? "text-[#FF3B30]"
      : charCount >= maxLength * 0.85
      ? "text-[#FF9500]"
      : "text-[#AEAEB2]"
    : "text-[#AEAEB2]";

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[0.88rem] font-medium ml-1 transition-colors duration-200 ${labelColor}`}>
        {label}
      </label>

      <div className="relative">
        <textarea
          {...props}
          maxLength={maxLength}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onChange={(e) => { setCharCount(e.target.value.length); onChange?.(e); }}
          className={`
            w-full
            min-h-[120px]
            ${bgColor}
            border
            ${borderColor}
            rounded-[20px]
            px-5
            py-4
            pr-11
            text-[1rem]
            text-[#1D1D1F]
            outline-none
            resize-none
            transition-all
            duration-200
            placeholder:text-[#AEAEB2]
            focus:ring-4
          `}
        />

        {error && (
          <span className="absolute right-4 top-4 text-[#FF3B30] text-lg pointer-events-none">
            ✕
          </span>
        )}
        {success && !error && (
          <span className="absolute right-4 top-4 text-[#34C759] text-lg pointer-events-none">
            ✓
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        {error ? (
          <p className="text-[0.78rem] text-[#FF3B30] ml-1">{error}</p>
        ) : success ? (
          <p className="text-[0.78rem] text-[#34C759] ml-1">Perfecto</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className={`text-[0.75rem] mr-1 transition-colors duration-200 ${charCountColor}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}