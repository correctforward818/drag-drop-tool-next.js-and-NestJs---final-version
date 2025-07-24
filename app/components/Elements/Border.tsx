import React from "react";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";

const BORDER_STYLES = ["none", "solid", "dashed", "dotted", "double"];

export interface BorderValue {
  borderTopWidth?: string;
  borderTopStyle?: string;
  borderTopColor?: string;
  borderRightWidth?: string;
  borderRightStyle?: string;
  borderRightColor?: string;
  borderBottomWidth?: string;
  borderBottomStyle?: string;
  borderBottomColor?: string;
  borderLeftWidth?: string;
  borderLeftStyle?: string;
  borderLeftColor?: string;
}

interface BorderProps {
  border: BorderValue;
  moreOptions: boolean;
  onChange: (border: BorderValue) => void;
  onToggleMoreOptions: (checked: boolean) => void;
  label?: string;
}

const Border: React.FC<BorderProps> = ({
  border,
  moreOptions,
  onChange,
  onToggleMoreOptions,
  label = "Border",
}) => {
  // Helper to update one or more border props
  const update = (patch: Partial<BorderValue>) => {
    onChange({ ...border, ...patch });
  };

  // For "all sides", use top as the main value
  const width = parseInt(border.borderTopWidth || "0");
  const style = border.borderTopStyle || "none";
  const color = border.borderTopColor || "#000000";

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
      <div className="grid grid-cols-2 gap-2">
        {!moreOptions ? (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              All Sides
            </label>
            <NumberInput
              value={width}
              onChange={(value) =>
                update({
                  borderTopWidth: `${value}px`,
                  borderBottomWidth: `${value}px`,
                  borderLeftWidth: `${value}px`,
                  borderRightWidth: `${value}px`,
                })
              }
            />
            <select
              value={style}
              onChange={(e) =>
                update({
                  borderTopStyle: e.target.value,
                  borderBottomStyle: e.target.value,
                  borderLeftStyle: e.target.value,
                  borderRightStyle: e.target.value,
                })
              }
              className="w-fit rounded-md border border-gray-300"
            >
              {BORDER_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="color"
              value={color}
              onChange={(e) =>
                update({
                  borderTopColor: e.target.value,
                  borderBottomColor: e.target.value,
                  borderLeftColor: e.target.value,
                  borderRightColor: e.target.value,
                })
              }
              className="rounded-md border border-gray-300"
            />
          </div>
        ) : (
          <>
            {/* Top */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top
              </label>
              <NumberInput
                value={parseInt(border.borderTopWidth || "0")}
                onChange={(value) =>
                  update({ borderTopWidth: `${value}px` })
                }
              />
              <select
                value={border.borderTopStyle || "none"}
                onChange={(e) =>
                  update({ borderTopStyle: e.target.value })
                }
                className="w-fit rounded-md border border-gray-300"
              >
                {BORDER_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={border.borderTopColor || "#000000"}
                onChange={(e) =>
                  update({ borderTopColor: e.target.value })
                }
              />
            </div>
            {/* Right */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Right
              </label>
              <NumberInput
                value={parseInt(border.borderRightWidth || "0")}
                onChange={(value) =>
                  update({ borderRightWidth: `${value}px` })
                }
              />
              <select
                value={border.borderRightStyle || "none"}
                onChange={(e) =>
                  update({ borderRightStyle: e.target.value })
                }
                className="w-fit rounded-md border border-gray-300"
              >
                {BORDER_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={border.borderRightColor || "#000000"}
                onChange={(e) =>
                  update({ borderRightColor: e.target.value })
                }
              />
            </div>
            {/* Bottom */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bottom
              </label>
              <NumberInput
                value={parseInt(border.borderBottomWidth || "0")}
                onChange={(value) =>
                  update({ borderBottomWidth: `${value}px` })
                }
              />
              <select
                value={border.borderBottomStyle || "none"}
                onChange={(e) =>
                  update({ borderBottomStyle: e.target.value })
                }
                className="w-fit rounded-md border border-gray-300"
              >
                {BORDER_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={border.borderBottomColor || "#000000"}
                onChange={(e) =>
                  update({ borderBottomColor: e.target.value })
                }
              />
            </div>
            {/* Left */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left
              </label>
              <NumberInput
                value={parseInt(border.borderLeftWidth || "0")}
                onChange={(value) =>
                  update({ borderLeftWidth: `${value}px` })
                }
              />
              <select
                value={border.borderLeftStyle || "none"}
                onChange={(e) =>
                  update({ borderLeftStyle: e.target.value })
                }
                className="w-fit rounded-md border border-gray-300"
              >
                {BORDER_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={border.borderLeftColor || "#000000"}
                onChange={(e) =>
                  update({ borderLeftColor: e.target.value })
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Border;
