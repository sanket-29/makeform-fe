"use client";

import {
  CheckCircle,
  ListChecks,
  DollarSign,
  FileCheck,
  SearchIcon,
  LucideIcon,
  Check,
} from "lucide-react";
import ActionButton from "./action-button";

export interface ActionButtonItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

// 🔥 CONFIG
export const ACTION_BUTTONS: ActionButtonItem[] = [
  {
    id: "signoffs",
    label: "Sign Offs",
    icon: CheckCircle,
    color: "text-blue-400",
  },
  {
    id: "checklist",
    label: "Checklist",
    icon: ListChecks,
    color: "text-yellow-400",
  },
  {
    id: "payfee",
    label: "Pay Fee",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    id: "permit",
    label: "Issue Permit",
    icon: FileCheck,
    color: "text-purple-400",
  },
  {
    id: "inspection",
    label: "Inspection",
    icon: SearchIcon,
    color: "text-cyan-400",
  },
];

interface ActionButtonsProps {
  activeAction: string;
  onActionChange: (action: string) => void;
  completedSteps: Set<string>; // ✅ NEW
}

export default function ActionButtons({
  activeAction,
  onActionChange,
  completedSteps,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-0">
      {ACTION_BUTTONS.map((button) => {
        const isCompleted = completedSteps.has(button.id);

        return (
          <ActionButton
            key={button.id}
            label={button.label}
            onClick={() => onActionChange(button.id)}
            isActive={activeAction === button.id}
            icon={
              isCompleted ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500">

                <Check size={20} className="animate-pulse" /></div>
              ) : (
                <button.icon size={20} className={button.color} />
              )
            }

            // 🔥 Pass completed state (optional styling)
            // isCompleted={isCompleted}
          />
        );
      })}
    </div>
  );
}