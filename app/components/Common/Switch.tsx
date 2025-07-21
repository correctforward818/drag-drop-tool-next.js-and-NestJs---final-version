import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      {label && (
        <span
          className={`
          mr-3 text-sm font-medium
          transition-colors duration-200
          ${checked ? "text-gray-900" : "text-gray-600"}
          group-hover:text-gray-900
        `}
        >
          {label}
        </span>
      )}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`
          w-11 h-6 rounded-full
          transition-all duration-300 ease-in-out
          ${
            checked
              ? "bg-gradient-to-r from-blue-500 to-blue-400 shadow-blue-500/25"
              : "bg-gradient-to-r from-gray-300 to-gray-200 shadow-gray-400/20"
          }
          shadow-lg
          group-hover:shadow-xl
          group-hover:${
            checked ? "from-blue-600 to-blue-500" : "from-gray-400 to-gray-300"
          }
          group-active:scale-95
        `}
        />
        <div
          className={`
          absolute left-1 top-1
          w-4 h-4 rounded-full
          bg-white
          shadow-sm
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          transform ${checked ? "translate-x-5" : "translate-x-0"}
          group-hover:scale-110
          group-hover:shadow-md
        `}
        >
          {checked ? (
            <CheckIcon className="w-2.5 h-2.5 text-blue-500" />
          ) : (
            <XMarkIcon className="w-2.5 h-2.5 text-gray-400" />
          )}
        </div>
        <div
          className={`
          absolute inset-0
          flex items-center
          transition-opacity duration-300
          ${checked ? "justify-start pl-2" : "justify-end pr-2"}
          opacity-0 group-hover:opacity-100
        `}
        >
          {checked ? (
            <CheckIcon className="w-2.5 h-2.5 text-white" />
          ) : (
            <XMarkIcon className="w-2.5 h-2.5 text-white" />
          )}
        </div>
      </div>
    </label>
  );
};

export default Switch;
