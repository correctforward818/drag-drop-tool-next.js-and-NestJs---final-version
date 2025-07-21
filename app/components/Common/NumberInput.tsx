import React from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unit = 'px'
}) => {
  const handleIncrease = () => {
    if (max !== undefined && value >= max) return;
    onChange(value + step);
  };

  const handleDecrease = () => {
    if (min !== undefined && value <= min) return;
    onChange(value - step);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={`
          p-2 border border-gray-200 rounded-l-md
          hover:bg-gray-50 active:bg-gray-100
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-100
        `}
      >
        <MinusIcon className="w-4 h-4 text-gray-600" />
      </button>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          min={min}
          max={max}
          step={step}
          className="pr-8 rounded-md"
        />
        <span className={`
          absolute right-3 top-1/2 -translate-y-1/2
          text-sm text-gray-500
          pointer-events-none
        `}>
          {unit}
        </span>
      </div>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={`
          p-2 border border-gray-200 rounded-r-md
          hover:bg-gray-50 active:bg-gray-100
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-100
        `}
      >
        <PlusIcon className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default NumberInput; 