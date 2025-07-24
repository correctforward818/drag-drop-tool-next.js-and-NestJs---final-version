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
        {onChange ? (
            <input
                type={inputType}
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-xs rounded-md border-gray-300 px-1 py-0.5"
                readOnly={readOnly}
            />
        ) : (
            value !== undefined && (
                <span className="text-xs text-gray-500 w-full block">{value}</span>
            )
        )}
    </div>
);

export default LabelInput; 