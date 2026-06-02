export default function DropdownItem({
  label,
  icon,
  danger = false,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-gray-300 hover:bg-white/5"
      }`}
    >
      <span className="opacity-80">{icon}</span>
      {label}
    </div>
  );
}