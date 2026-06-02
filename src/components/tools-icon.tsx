export default function ToolIcon({
  icon,
  label,
  danger,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      title={label}
      className={`p-2 rounded-md cursor-pointer transition
        ${danger ? "text-red-400 hover:bg-red-500/10" : ""}
        ${
          active
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }
      `}
    >
      {icon}
    </div>
  );
}