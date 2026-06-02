"use client";

export default function ActionButton({
  label,
  icon,
  onClick,
  isActive,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-2 rounded-lg border text-xs transition
        
        ${
          isActive
            ? "bg-white/10 border-blue-500 shadow-md"
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500"
        }
      `}
    >
      <span className="flex items-center flex-shrink-0">{icon}</span>

      <span className="font-medium text-left">
        {label}
      </span>
    </button>
  );
}