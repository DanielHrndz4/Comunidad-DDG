interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <p className="text-sm text-[#FF3B30] mt-1 ml-1 transition-all duration-200 animate-fadeIn">
      {message}
    </p>
  );
}