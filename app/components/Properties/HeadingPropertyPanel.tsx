import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ElementType } from "../../types/template";
import { useBuilder } from "../../hooks/useBuilder";
import Collapse from "../Common/Collapse";
import { DocumentTextIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";

interface HeadingPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

interface HeadingInputState {
  text: string;
  headingType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color: string;
  fontFamily: {
    label: string;
    value: string;
    url?: string;
    defaultFont?: boolean;
    weights?: null;
  };
  fontSize: string;
  fontWeight: number;
  textAlign: string;
  lineHeight: string;
  letterSpacing: string;
  containerPadding: string;
  href?: {
    url: string;
    target: string;
  };
}

const HEADING_TYPES = ["h1", "h2", "h3", "h4"];
const TEXT_ALIGN_OPTIONS = ["left", "center", "right"] as const;

const FONT_FAMILY_OPTIONS = [
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

const TARGET_OPTIONS = [
  { value: "_blank", label: "New Window" },
  { value: "_self", label: "Same Window" },
];

const HeadingPropertyPanel: React.FC<HeadingPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();
  const [headingInputs, setHeadingInputs] = useState<HeadingInputState>({
    text: "",
    headingType: "h1",
    color: "#000000",
    fontFamily: {
      label: "Arial",
      value: "Arial",
      defaultFont: true,
    },
    fontSize: "32px",
    fontWeight: 700,
    textAlign: "left",
    lineHeight: "120%",
    letterSpacing: "0px",
    containerPadding: "10px",
    href: {
      url: "",
      target: "_blank",
    },
  });
  const [moreOptions, setMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);

    if (element && element.values) {
      setHeadingInputs({
        text: element.values.text || "",
        headingType: element.values.headingType || "h1",
        color: element.values.color || "#000000",
        fontFamily: element.values.fontFamily || {
          label: "Arial",
          value: "Arial",
          defaultFont: true,
        },
        fontSize: element.values.fontSize || "32px",
        fontWeight: element.values.fontWeight || 700,
        textAlign: element.values.textAlign || "left",
        lineHeight: element.values.lineHeight || "120%",
        letterSpacing: element.values.letterSpacing || "0px",
        containerPadding: element.values.containerPadding || "10px",
      });
    }
  }, [selectedElement]);

  const handleInputChange = (
    property: string,
    value: any,
    nestedProperty?: string
  ) => {
    setHeadingInputs((prev) => {
      if (nestedProperty) {
        return {
          ...prev,
          [property]: {
            ...(prev[property as keyof HeadingInputState] as any),
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
            ...(headingInputs[property as keyof HeadingInputState] as any),
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
              {t("builder.properties.heading.type")}
            </label>
            <div className="flex items-center">
              {HEADING_TYPES.map((type) => (
                <div
                  key={type}
                  className={`w-10 h-10 flex items-center justify-center border  ${
                    headingInputs.headingType === type
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                  }`}
                  onClick={() => handleInputChange("headingType", type)}
                >
                  {type.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.font.family")}
            </label>
            <select
              value={headingInputs.fontFamily.value}
              onChange={(e) =>
                handleInputChange("fontFamily", e.target.value, "value")
              }
              className="w-24"
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
              className={`w-24`}
              style={{
                fontWeight: headingInputs.fontWeight,
              }}
              value={headingInputs.fontWeight}
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
              value={parseInt(headingInputs.fontSize)}
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
              value={headingInputs.color}
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
                    headingInputs.textAlign === align ? "bg-gray-200" : ""
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
              value={parseInt(headingInputs.lineHeight)}
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
              value={Number(parseFloat(headingInputs.letterSpacing).toFixed(1))}
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
                      headingInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);
                  } else {
                    const currentValue = parseInt(
                      headingInputs.containerPadding.split(" ")[0]
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
                  value={parseInt(headingInputs.containerPadding)}
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
                    value={parseInt(headingInputs.containerPadding.split(" ")[0])}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        headingInputs.containerPadding.split(" ");
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
                      parseInt(headingInputs.containerPadding.split(" ")[1])
                    }
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        headingInputs.containerPadding.split(" ");
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
                      parseInt(headingInputs.containerPadding.split(" ")[2])
                    }
                    onChange={(value) => {
                      const [top, right, _, left] =
                        headingInputs.containerPadding.split(" ");

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
                      parseInt(headingInputs.containerPadding.split(" ")[3])
                    }

                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        headingInputs.containerPadding.split(" ");
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

export default HeadingPropertyPanel;
