import React from "react";

interface BackgroundColorProps {
    color: string;
    onChange: (color: string) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
}

const BackgroundColor: React.FC<BackgroundColorProps> = ({
    color,
    onChange,
    label = "Background Color",
    className = "",
    disabled = false,
}) => (
    <div className={`flex items-center justify-between w-full ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-0">
                {label}
            </label>
        )}
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 rounded-md border-gray-300"
                disabled={disabled}
                aria-label={label}
            />
            <span className="text-xs text-gray-500">{color}</span>
        </div>
    </div>
);

export default BackgroundColor;