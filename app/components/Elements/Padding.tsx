import React from "react";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";

interface PaddingProps {
  padding: string;
  moreOptions: boolean;
  onChange: (padding: string) => void;
  onToggleMoreOptions: (checked: boolean) => void;
  label?: string;
  min?: number;
  max?: number;
}

const Padding: React.FC<PaddingProps> = ({
  padding,
  moreOptions,
  onChange,
  onToggleMoreOptions,
  label = "Padding",
  min = 0,
  max = 100,
}) => {
  // Parse padding string into array of 4 values
  const getPaddingArray = () => {
    const arr = padding.split(" ");
    if (arr.length === 1) {
      return [arr[0], arr[0], arr[0], arr[0]];
    }
    if (arr.length === 4) {
      return arr;
    }
    // fallback: fill missing with first value
    return [arr[0], arr[1] || arr[0], arr[2] || arr[0], arr[3] || arr[0]];
  };

  const [top, right, bottom, left] = getPaddingArray();

  const handleAllSidesChange = (value: number) => {
    onChange(`${value}px`);
  };

  const handleSideChange = (side: "top" | "right" | "bottom" | "left", value: number) => {
    const values = { top, right, bottom, left };
    values[side] = `${value}px`;
    onChange(`${values.top} ${values.right} ${values.bottom} ${values.left}`);
  };

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
          <label className="block text-sm text-gray-600 mb-1">All Sides</label>
          <NumberInput
            value={parseInt(top)}
            onChange={handleAllSidesChange}
            min={min}
            max={max}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Top</label>
            <NumberInput
              value={parseInt(top)}
              onChange={(value) => handleSideChange("top", value)}
              min={min}
              max={max}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Right</label>
            <NumberInput
              value={parseInt(right)}
              onChange={(value) => handleSideChange("right", value)}
              min={min}
              max={max}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bottom</label>
            <NumberInput
              value={parseInt(bottom)}
              onChange={(value) => handleSideChange("bottom", value)}
              min={min}
              max={max}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Left</label>
            <NumberInput
              value={parseInt(left)}
              onChange={(value) => handleSideChange("left", value)}
              min={min}
              max={max}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Padding;