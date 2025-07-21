import { useTranslation } from "react-i18next";
import type { ElementType, DividerValues } from "../../types/template";
import { useEffect, useState } from "react";
import { useBuilder } from "~/hooks/useBuilder";
import Collapse from "../Common/Collapse";
import { MinusIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";

interface DividerPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

const DividerPropertyPanel: React.FC<DividerPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();

  const [dividerInputs, setDividerInputs] = useState<DividerValues>({
    containerPadding: "10px",
    border: {
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderTopColor: "#000000",
    },
    textAlign: "left",
    width: "100%",
  });
  const [containerMoreOptions, setContainerMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);

    if (element && element.values) {
      setDividerInputs({
        containerPadding: element.values.containerPadding || "10px",
        border: {
          borderTopWidth: element.values.border?.borderTopWidth || "1px",
          borderTopStyle: element.values.border?.borderTopStyle || "solid",
          borderTopColor: element.values.border?.borderTopColor || "#000000",
        },
        textAlign: element.values.textAlign || "left",
        width: element.values.width || "100%",
      });
    }
  }, [selectedElement, template]);

  const handleInputChange = (
    property: string,
    value: any,
    nestedProperty?: string
  ) => {
    setDividerInputs((prev) => {
      if (nestedProperty) {
        return {
          ...prev,
          [property]: {
            ...(prev[property as keyof DividerValues] as any),
            [nestedProperty]: value,
          },
        };
      }
      return {
        ...prev,
        [property]: value,
      };
    });

    const tempValue = nestedProperty
      ? {
          [property]: {
            ...(dividerInputs[property as keyof DividerValues] as any),
            [nestedProperty]: value,
          },
        }
      : { [property]: value };

    updateContent(selectedElement.id, tempValue);
  };

  return (
    <>
      <Collapse
        icon={<MinusIcon className="w-5 h-5" />}
        title={t("builder.properties.divider.line")}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.width")}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(dividerInputs.width)}
              onChange={(e) => handleInputChange("width", `${e.target.value}%`)}
              style={{ width: "150px" }}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.divider.line")}
            </label>
            
            <div className="w-40 flex flex-col gap-2 items-end">
              <select
                value={dividerInputs.border.borderTopStyle}
                onChange={(e) => handleInputChange("border", e.target.value, "borderTopStyle")}
              >
                <option value="solid">{t("builder.properties.sharedStyles.lineTypes.solid")}</option>
                <option value="dotted">{t("builder.properties.sharedStyles.lineTypes.dotted")}</option>
                <option value="dashed">{t("builder.properties.sharedStyles.lineTypes.dashed")}</option>
              </select>

              <NumberInput
                value={parseInt(dividerInputs.border.borderTopWidth)}
                onChange={(value) => handleInputChange("border", value, "borderTopWidth")}
              />

              <input type="color"
                value={dividerInputs.border.borderTopColor}
                onChange={(e) => handleInputChange("border", e.target.value, "borderTopColor")}
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {t("builder.properties.sharedStyles.alignment.label")}
          </label>
          <div className="flex gap-2">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() => handleInputChange("textAlign", align)}
                className={`p-2 hover:bg-gray-100 rounded ${
                  dividerInputs.textAlign === align ? "bg-gray-200" : ""
                }`}
                title={t(`builder.properties.align.${align}`)}
              >
                {align === "left" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {align === "center" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {align === "right" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 5a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
        </div>
      </Collapse>

      <Collapse
        icon={<Cog6ToothIcon className="h-5 w-5" />}
        title={t("builder.properties.general.title")}
        defaultOpen
      >
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-700">
                {t("builder.properties.general.containerPadding")}
              </label>
              <Switch
                checked={containerMoreOptions}
                onChange={(checked: boolean) => {
                  setContainerMoreOptions(checked);
                  if (!checked) {
                    // Reset to single value when disabling more options
                    const currentValue = parseInt(
                      dividerInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);
                  } else {
                    const currentValue = parseInt(
                      dividerInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange(
                      "containerPadding",
                      `${currentValue}px ${currentValue}px ${currentValue}px ${currentValue}px`
                    );
                  }
                }}
                label={t("builder.properties.general.moreOptions")}
              />
            </div>
            {!containerMoreOptions ? (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("builder.properties.general.allSides")}
                </label>
                <NumberInput
                  value={parseInt(dividerInputs.containerPadding)}
                  onChange={(value) =>
                    handleInputChange("containerPadding", `${value}px`)
                  }
                  min={0}
                  max={100}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("builder.properties.general.padding.top")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      dividerInputs.containerPadding.split(" ")[0]
                    )}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        dividerInputs.containerPadding.split(" ");
                      handleInputChange(
                        "containerPadding",
                        `${value}px ${right} ${bottom} ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("builder.properties.general.padding.right")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      dividerInputs.containerPadding.split(" ")[1]
                    )}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        dividerInputs.containerPadding.split(" ");
                      handleInputChange(
                        "containerPadding",
                        `${top} ${value}px ${bottom} ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("builder.properties.general.padding.bottom")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      dividerInputs.containerPadding.split(" ")[2]
                    )}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        dividerInputs.containerPadding.split(" ");
                      handleInputChange(
                        "containerPadding",
                        `${top} ${right} ${value}px ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("builder.properties.general.padding.left")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      dividerInputs.containerPadding.split(" ")[3]
                    )}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        dividerInputs.containerPadding.split(" ");
                      handleInputChange(
                        "containerPadding",
                        `${top} ${right} ${bottom} ${value}px`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default DividerPropertyPanel;
