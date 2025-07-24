import React from "react";

interface ContentAlignmentProps {
    value: "top" | "center" | "bottom";
    onChange: (value: "top" | "center" | "bottom") => void;
    label?: string;
    disabled?: boolean;
}

const options = [
    { value: "top", label: "Top" },
    { value: "center", label: "Center" },
    { value: "bottom", label: "Bottom" },
];

const ContentAlignment: React.FC<ContentAlignmentProps> = ({
    value,
    onChange,
    label = "Content Alignment",
    disabled = false,
}) => (
    <div className="flex flex-col gap-1">
        <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
        <div className="flex gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    className={`px-3 py-1 rounded border text-xs font-medium transition
            ${value === opt.value
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
                    onClick={() => !disabled && onChange(opt.value as "top" | "center" | "bottom")}
                    disabled={disabled}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export default ContentAlignment;