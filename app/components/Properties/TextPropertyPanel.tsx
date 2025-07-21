import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ElementType, TextValues } from "../../types/template";
import { useBuilder } from "../../hooks/useBuilder";
import Collapse from "../Common/Collapse";
import { DocumentTextIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";


interface TextPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

const TEXT_ALIGN_OPTIONS = ["left", "center", "right"] as const;

export const FONT_FAMILY_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Garamond", label: "Garamond" },
  { value: "Palatino", label: "Palatino" },
  { value: "Bookman", label: "Bookman" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
];

const TextPropertyPanel: React.FC<TextPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();
  const [textInputs, setTextInputs] = useState<TextValues>({
    color: "#FFFFFF",
    containerPadding: "10px",
    fontFamily: {
      label: "Arial",
      value: "Arial",
      url: "",
      defaultFont: true,
      weights: null,
    },
    fontSize: "14px",
    fontWeight: 400,
    textAlign: "center",
    lineHeight: "120%",
    letterSpacing: "0px",
    text: "This is a new Text block. Change the text",
  });
  const [moreOptions, setMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);
      
      if (element && element.values) {
      console.log(element.values.fontSize)
      setTextInputs({
        color: element.values.color || "#FFFFFF",
        containerPadding: element.values.containerPadding || "10px",
        fontFamily: element.values.fontFamily,
        fontSize: element.values.fontSize || "14px",
        fontWeight: element.values.fontWeight || 400,
        textAlign: element.values.textAlign || "center",
        lineHeight: element.values.lineHeight || "120%",
        letterSpacing: element.values.letterSpacing || "0px",
        text:
          element.values.text || "This is a new Text block. Change the text",
      });
    }
  }, [selectedElement]);

  const handleInputChange = (
    property: string,
    value: any,
    nestedProperty?: string
  ) => {
    setTextInputs((prev) => {
      if (nestedProperty) {
        return {
          ...prev,
          [property]: {
            ...(prev[property as keyof TextValues] as any),
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
            ...(textInputs[property as keyof TextValues] as any),
            [nestedProperty]: value,
          },
        }
      : { [property]: value };

    updateContent(selectedElement.id, tempValue);
  };

  return (
    <>
      <Collapse
        icon={<DocumentTextIcon className="w-5 h-5" />}
        title={t("builder.properties.sharedStyles.text")}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.font.family")}
            </label>
            <select
              value={textInputs.fontFamily?.value}
              onChange={(e) =>
                handleInputChange("fontFamily", e.target.value, "value")
              }
              className="w-fit"
            >
              {FONT_FAMILY_OPTIONS.map((font) => (
                <option
                  key={font.value}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.font.weight")}
            </label>
            <select
              className={`w-fit`}
              style={{
                fontWeight: textInputs.fontWeight,
              }}
              value={textInputs.fontWeight}
              onChange={(e) => handleInputChange("fontWeight", e.target.value)}
            >
              <option value={400}>
                {t("builder.properties.heading.weights.regular")}
              </option>
              <option value={700} className="font-bold">
                {t("builder.properties.heading.weights.bold")}
              </option>
            </select>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.font.size")}
            </label>
            <NumberInput 
              value={parseInt(textInputs.fontSize)}
              onChange={(value) => handleInputChange("fontSize", `${value}px`)}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.color")}
            </label>
            <input
              type="color"
              value={textInputs.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              className="rounded-md border border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.alignment.textAlign")}
            </label>
            <div className="flex gap-2">
              {TEXT_ALIGN_OPTIONS.map((align) => (
                <button
                  key={align}
                  onClick={() => handleInputChange("textAlign", align)}
                  className={`p-2 hover:bg-gray-100 rounded ${
                    textInputs.textAlign === align ? "bg-gray-200" : ""
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

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.font.lineHeight")}
            </label>
            <NumberInput
              value={parseInt(textInputs.lineHeight)}
              onChange={(value) => handleInputChange("lineHeight", `${value}%`)}
              unit="%"
              step={10}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.font.letterSpacing")}
            </label>
            <NumberInput
              value={Number(parseFloat(textInputs.letterSpacing).toFixed(1))}
              onChange={(value) => handleInputChange("letterSpacing", value)}
              step={0.1}
            />
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
                checked={moreOptions}
                onChange={(checked) => {
                  setMoreOptions(checked);
                  if (!checked) {
                    // Reset to single value when disabling more options
                    const currentValue = parseInt(
                      textInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);

                  } else {
                    const currentValue = parseInt(
                      textInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px ${currentValue}px ${currentValue}px ${currentValue}px`);
                  }

                }}
                label={t("builder.properties.general.moreOptions")}
              />
            </div>
            {!moreOptions ? (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("builder.properties.general.allSides")}
                </label>
                <NumberInput
                  value={parseInt(textInputs.containerPadding)}
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
                    value={parseInt(textInputs.containerPadding.split(" ")[0])}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        textInputs.containerPadding.split(" ");
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
                    value={
                      parseInt(textInputs.containerPadding.split(" ")[1])
                    }

                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        textInputs.containerPadding.split(" ");
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
                    value={
                      parseInt(textInputs.containerPadding.split(" ")[2])
                    }

                    onChange={(value) => {
                      const [top, right, _, left] =
                        textInputs.containerPadding.split(" ");
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
                    value={
                      parseInt(textInputs.containerPadding.split(" ")[3])
                    }
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        textInputs.containerPadding.split(" ");
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

export default TextPropertyPanel;
