import React from "react";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";

export interface BorderRoundValue {
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomLeftRadius?: string;
}

interface BorderRoundProps {
    borderRound: BorderRoundValue;
    moreOptions: boolean;
    onChange: (border: BorderRoundValue) => void;
    onToggleMoreOptions: (checked: boolean) => void;
    label?: string;
}

const BorderRound: React.FC<BorderRoundProps> = ({
    borderRound,
    moreOptions,
    onChange,
    onToggleMoreOptions,
    label = "Border Radius",
}) => {
    const update = (patch: Partial<BorderRoundValue>) => {
        onChange({ ...borderRound, ...patch });
    };

    const value = parseInt(borderRound.borderTopLeftRadius || "0");

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <Switch
                    checked={moreOptions}
                    onChange={onToggleMoreOptions}
                    label="More options"
                />
            </div>
            {!moreOptions ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        All Corners
                    </label>
                    <NumberInput
                        value={value}
                        onChange={(v) =>
                            update({
                                borderTopLeftRadius: `${v}px`,
                                borderTopRightRadius: `${v}px`,
                                borderBottomRightRadius: `${v}px`,
                                borderBottomLeftRadius: `${v}px`,
                            })
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Top Left</label>
                        <NumberInput
                            value={parseInt(borderRound.borderTopLeftRadius || "0")}
                            onChange={(v) => update({ borderTopLeftRadius: `${v}px` })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Top Right</label>
                        <NumberInput
                            value={parseInt(borderRound.borderTopRightRadius || "0")}
                            onChange={(v) => update({ borderTopRightRadius: `${v}px` })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Bottom Right</label>
                        <NumberInput
                            value={parseInt(borderRound.borderBottomRightRadius || "0")}
                            onChange={(v) => update({ borderBottomRightRadius: `${v}px` })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Bottom Left</label>
                        <NumberInput
                            value={parseInt(borderRound.borderBottomLeftRadius || "0")}
                            onChange={(v) => update({ borderBottomLeftRadius: `${v}px` })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorderRound;