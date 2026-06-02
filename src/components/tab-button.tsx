export default function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-2 py-2 text-sm transition
        
        ${
          active
            ? "text-blue-400"
            : "text-gray-400 hover:text-white"
        }
      `}
    >
      {label}

      {/* 🔥 Blue underline */}
      {active && (
        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-500 rounded-full" />
      )}
    </button>
  );
}