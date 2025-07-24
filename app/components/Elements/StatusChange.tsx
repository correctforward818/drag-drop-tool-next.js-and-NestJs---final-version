import React from "react";
import Switch from "../Common/Switch";

interface StatusChangeProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const StatusChange: React.FC<StatusChangeProps> = ({ label, value, onChange }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-0">
                {label}
            </label>
            <Switch
                checked={value}
                onChange={onChange}
                label=""
            />
        </div>
    );
};

export default StatusChange;
