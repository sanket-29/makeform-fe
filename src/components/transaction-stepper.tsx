"use client";

import { Check } from "lucide-react";
import { ReactNode } from "react";

interface Step {
  id: string;
  label: string;
  completed: boolean;
  icon?: ReactNode;
}

interface TransactionStepperProps {
  steps: Step[];
}

export default function TransactionStepper({ steps }: TransactionStepperProps) {
  return (
    <div className="mb-6 pb-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-all duration-500 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white scale-110"
                      : "border-gray-500 text-gray-400 scale-100"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} className="animate-pulse" />
                  ) : step.icon ? (
                    <div className="flex items-center justify-center">{step.icon}</div>
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    isCompleted ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connection Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2 relative overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 right-0 h-full bg-gray-600" />
                  <div
                    className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-700 ease-out ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
