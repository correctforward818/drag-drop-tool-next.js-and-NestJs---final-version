import React from "react";

interface LabelInputProps {
    label: string;
    value?: string | number;
    onChange?: (value: string) => void;
    placeholder?: string;
    inputType?: string;
    className?: string;
    readOnly?: boolean;
}

const LabelInput: React.FC<LabelInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    inputType = "text",
    className = "",
    readOnly = false,
}) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="block text-xs font-medium text-gray-700 mb-0">
            {label}
        </label>
        <input
            type={inputType}
            value={value ?? ""}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-1 py-0.5"
            readOnly={readOnly || !onChange}
        />
    </div>
);

export default LabelInput;
