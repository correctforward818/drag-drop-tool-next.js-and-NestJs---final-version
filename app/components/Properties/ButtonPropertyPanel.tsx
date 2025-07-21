import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ElementType, ButtonValues } from "../../types/template";
import { useBuilder } from "../../hooks/useBuilder";
import Collapse from "../Common/Collapse";
import {
  LinkIcon,
  CogIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Switch from "../Common/Switch";
import NumberInput from "../Common/NumberInput";

interface ButtonPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

const TEXT_ALIGN_OPTIONS = ["left", "center", "right"];
const BORDER_STYLES = ["none", "solid", "dashed", "dotted", "double"];

const ButtonPropertyPanel: React.FC<ButtonPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();
  const [buttonInputs, setButtonInputs] = useState<ButtonValues>({
    href: {
      name: "web",
      values: {
        href: "",
        target: "_blank",
      },
    },
    buttonColors: {
      backgroundColor: "#3AAEE0",
      color: "#FFFFFF",
    },
    size: {
      autoWidth: true,
      width: "fit-content",
    },
    fontFamily: {
      label: "Arial",
      value: "Arial",
      url: "",
      defaultFont: true,
      weights: null,
    },
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "120%",
    letterSpacing: "0px",
    textAlign: "center",
    padding: "10px",
    border: {
      borderWidth: "0px",
      borderStyle: "none",
      borderColor: "#CCCCCC",
    },
    borderRadius: "4px",
    containerPadding: "10px",
  });

  const [paddingMoreOptions, setPaddingMoreOptions] = useState(false);
  const [boderRadiusMore, setBoderRadiusMore] = useState(false);
  const [containerMoreOptions, setContainerMoreOptions] = useState(false);
  const [borderMoreOptions, setBorderMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);

    if (element && element.values) {
      setButtonInputs({
        href: element.values.href || {
          name: "web",
          values: {
            href: "",
            target: "_blank",
          },
        },
        buttonColors: element.values.buttonColors || {
          backgroundColor: "#3AAEE0",
          color: "#FFFFFF",
        },
        size: element.values.size || {
          autoWidth: true,
          width: "fit-content",
        },
        fontFamily: element.values.fontFamily || {
          label: "Arial",
          value: "Arial",
          url: "",
          defaultFont: true,
          weights: null,
        },
        fontWeight: element.values.fontWeight || 400,
        fontSize: element.values.fontSize || "14px",
        lineHeight: element.values.lineHeight || "120%",
        letterSpacing: element.values.letterSpacing || "0px",
        textAlign: element.values.textAlign || "center",
        padding: element.values.padding
          ? element.values.padding.split(" ").length !== 2
            ? `${element.values.padding}`
            : `${element.values.padding} ${element.values.padding}`
          : "10px",
        border: element.values.border || {
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "#CCCCCC",
        },
        borderRadius: element.values.borderRadius || "4px",
        containerPadding: element.values.containerPadding || "10px",
      });
      setPaddingMoreOptions(element.values.padding?.split(" ").length! > 1);
    }
  }, [selectedElement, template]);

  const handleInputChange = (
    property: string,
    value: any,
    nestedProperty?: string
  ) => {
    setButtonInputs((prev) => {
      if (nestedProperty) {
        return {
          ...prev,
          [property]: {
            ...(prev[property as keyof ButtonValues] as any),
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
            ...(buttonInputs[property as keyof ButtonValues] as any),
            [nestedProperty]: value,
          },
        }
      : { [property]: value };

    updateContent(selectedElement.id, tempValue);
  };

  return (
    <>
      <Collapse
        icon={<LinkIcon className="w-5 h-5" />}
        title={t("builder.properties.button.action.label")}
        defaultOpen
      >
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("builder.properties.button.action.type")}
              </label>

              <select
                value={buttonInputs.href.name}
                onChange={(e) =>
                  handleInputChange("href", {
                    name: e.target.value,
                    values:
                      e.target.value === "web"
                        ? {
                            href: "",
                            target: "_blank",
                          }
                        : e.target.value === "mailto"
                        ? {
                            mailto: "",
                            subject: "",
                            body: "",
                          }
                        : {
                            phone: "",
                          },
                  })
                }
                className="w-fit rounded-md border border-gray-300"
              >
                <option value="web">
                  {t("builder.properties.actionTypeOptions.openWebsite")}
                </option>
                <option value="mailto">
                  {t("builder.properties.actionTypeOptions.sendEmail")}
                </option>
                <option value="tel">
                  {t("builder.properties.actionTypeOptions.callPhone")}
                </option>
              </select>
            </div>
            {buttonInputs.href.name === "web" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.button.action.url")}
                  </label>
                  <input
                    type="url"
                    style={{
                      borderRadius: 0,
                      border: "none",
                      borderLeft: "1px solid #CCCCCC",
                    }}
                    value={buttonInputs.href.values.href}
                    onChange={(e) =>
                      handleInputChange(
                        "href",
                        {
                          href: e.target.value,
                              target: buttonInputs.href.values.target,
                        },
                        "values"
                      )
                    }
                  />
                </div>
                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.button.action.target")}
                  </label>
                  <select
                    className="rounded-none"
                    value={buttonInputs.href.values.target}
                    onChange={(e) =>
                      handleInputChange(
                        "href",
                        {
                          href: buttonInputs.href.values.href,
                          target: e.target.value,
                        },
                        "values"
                      )
                    }
                  >
                    <option value="_self">
                      {t("builder.properties.targetOptions.sameTab")}
                    </option>
                    <option value="_blank">
                      {t("builder.properties.targetOptions.newTab")}
                    </option>
                  </select>
                </div>
              </div>
            ) : buttonInputs.href.name === "mailto" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.button.action.email.to")}
                  </label>
                  <input
                    type="url"
                    style={{
                      borderRadius: 0,
                      border: "none",
                      borderLeft: "1px solid #CCCCCC",
                      flex: 1,
                    }}
                    value={buttonInputs.href.values.mailto}
                    onChange={(e) =>
                      handleInputChange(
                        "href",
                        {
                          mailto: e.target.value,
                          subject: buttonInputs.href.values.subject,
                          body: buttonInputs.href.values.body,
                        },
                        "values"
                      )
                    }
                  />
                </div>
                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.button.action.email.subject")}
                  </label>
                  <input
                    type="text"
                    style={{
                      borderRadius: 0,
                      border: "none",
                      borderLeft: "1px solid #CCCCCC",
                    }}
                    value={buttonInputs.href.values.subject}
                    onChange={(e) =>
                      handleInputChange(
                        "href",
                        {
                          mailto: buttonInputs.href.values.mailto,
                          subject: e.target.value,
                          body: buttonInputs.href.values.body,
                        },
                        "values"
                      )
                    }
                  />
                </div>
                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.button.action.email.body")}
                  </label>
                  <textarea
                    style={{
                      borderRadius: 0,
                      border: "none",
                      borderLeft: "1px solid #CCCCCC",
                    }}
                    value={buttonInputs.href.values.body}
                    onChange={(e) =>
                      handleInputChange(
                        "href",
                        {
                          mailto: buttonInputs.href.values.mailto,
                          subject: buttonInputs.href.values.subject,
                          body: e.target.value,
                        },
                        "values"
                      )
                    }
                    rows={5}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center border">
                <label className="px-3">
                  {t("builder.properties.button.action.phone.label")}
                </label>
                <input
                  type="text"
                  style={{
                    borderRadius: 0,
                    border: "none",
                    borderLeft: "1px solid #CCCCCC",
                    flex: 1,
                  }}
                  value={buttonInputs.href.values.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "href",
                      {
                        phone: e.target.value,
                      },
                      "values"
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      </Collapse>

      <Collapse
        icon={<CogIcon className="w-5 h-5" />}
        title={t("builder.properties.button.options.label")}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500">Background Color</label>
            <input
              type="color"
              value={buttonInputs.buttonColors.backgroundColor}
              onChange={(e) =>
                handleInputChange(
                  "buttonColors",
                  e.target.value,
                  "backgroundColor"
                )
              }
              className="rounded-md border border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500">Text Color</label>
            <input
              type="color"
              value={buttonInputs.buttonColors.color}
              onChange={(e) =>
                handleInputChange("buttonColors", e.target.value, "color")
              }
              className="rounded-md border border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.width")}
            </label>
            <Switch
              label={
                buttonInputs.size.autoWidth
                  ? t("builder.properties.button.options.auto.on")
                  : t("builder.properties.button.options.auto.off")
              }
              checked={buttonInputs.size.autoWidth ?? false}
              onChange={(checked: boolean) =>
                handleInputChange("size", checked, "autoWidth")
              }
            />
          </div>

          {!buttonInputs.size.autoWidth && (
            <div className="flex items-center justify-between gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={parseInt(buttonInputs.size.width || "100")}
                onChange={(e) =>
                  handleInputChange("size", `${e.target.value}%`, "width")
                }
                className="flex-1"
              />
              <span className="ml-2 text-gray-500">
                {buttonInputs.size.width}
              </span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.font.lineHeight")}
            </label>
            <NumberInput
              value={parseInt(buttonInputs.lineHeight)}
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
              value={Number(parseFloat(buttonInputs.letterSpacing).toFixed(1))}
              onChange={(value) => handleInputChange("letterSpacing", value)}
              step={0.1}
            />
          </div>
        </div>
      </Collapse>

      <Collapse
        icon={<ArrowsPointingOutIcon className="w-5 h-5" />}
        title={t("builder.properties.sharedStyles.spacing")}
        defaultOpen
      >
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {t("builder.properties.sharedStyles.alignment.label")}
          </label>
          <div className="flex gap-2">
            {TEXT_ALIGN_OPTIONS.map((align) => (
              <button
                key={align}
                onClick={() => handleInputChange("textAlign", align)}
                className={`p-2 hover:bg-gray-100 rounded ${
                  buttonInputs.textAlign === align ? "bg-gray-200" : ""
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

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.padding")}
            </label>
            <Switch
              checked={paddingMoreOptions}
              onChange={(checked) => {
                setPaddingMoreOptions(checked);

                const currentValue = parseInt(
                  buttonInputs.padding.split(" ")[0]
                );

                if (!checked) {
                  // Reset to single value when disabling more options
                  handleInputChange("padding", `${currentValue}px`);
                } else {
                  handleInputChange(
                    "padding",
                    `${currentValue}px ${currentValue}px ${currentValue}px ${currentValue}px`
                  );
                }
              }}
              label={t("builder.properties.general.moreOptions")}
            />
          </div>
          {!paddingMoreOptions ? (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("builder.properties.general.allSides")}
              </label>
              <NumberInput
                value={parseInt(buttonInputs.padding)}
                onChange={(value) => handleInputChange("padding", `${value}px`)}
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
                  value={parseInt(buttonInputs.padding.split(" ")[0])}
                  onChange={(value) => {
                    const [_, right, bottom, left] =
                      buttonInputs.padding.split(" ");
                    handleInputChange(
                      "padding",
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
                  value={parseInt(buttonInputs.padding.split(" ")[1])}
                  onChange={(value) => {
                    const [top, _, bottom, left] =
                      buttonInputs.padding.split(" ");
                    handleInputChange(
                      "padding",
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
                  value={parseInt(buttonInputs.padding.split(" ")[2])}
                  onChange={(value) => {
                    const [top, right, _, left] =
                      buttonInputs.padding.split(" ");

                    handleInputChange(
                      "padding",
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
                  value={parseInt(buttonInputs.padding.split(" ")[3])}
                  onChange={(value) => {
                    const [top, right, bottom, _] =
                      buttonInputs.padding.split(" ");
                    handleInputChange(
                      "padding",
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

        <hr className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.border.radius")}
            </label>
            <Switch
              checked={boderRadiusMore}
              onChange={(checked) => {
                setBoderRadiusMore(checked);
                const currentValue = parseInt(
                  buttonInputs.borderRadius.split(" ")[0]
                );

                if (!checked) {
                  handleInputChange("borderRadius", `${currentValue}px`);
                } else {
                  handleInputChange(
                    "borderRadius",
                    `${currentValue}px ${currentValue}px ${currentValue}px ${currentValue}px`
                  );
                }
              }}
              label={t("builder.properties.general.moreOptions")}
            />
          </div>
          {!boderRadiusMore ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("builder.properties.general.allSides")}
              </label>
              <NumberInput
                value={parseInt(buttonInputs.borderRadius)}
                onChange={(value) =>
                  handleInputChange("borderRadius", `${value}px`)
                }
                min={0}
                max={100}
              />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.top")}
                  </label>
                  <NumberInput
                    value={parseInt(buttonInputs.borderRadius.split(" ")[0])}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        buttonInputs.borderRadius.split(" ");
                      handleInputChange(
                        "borderRadius",
                        `${value}px ${right} ${bottom} ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.right")}
                  </label>
                  <NumberInput
                    value={parseInt(buttonInputs.borderRadius.split(" ")[1])}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        buttonInputs.borderRadius.split(" ");
                      handleInputChange(
                        "borderRadius",
                        `${top} ${value}px ${bottom} ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.bottom")}
                  </label>
                  <NumberInput
                    value={parseInt(buttonInputs.borderRadius.split(" ")[2])}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        buttonInputs.borderRadius.split(" ");
                      handleInputChange(
                        "borderRadius",
                        `${top} ${right} ${value}px ${left}`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.left")}
                  </label>
                  <NumberInput
                    value={parseInt(buttonInputs.borderRadius.split(" ")[3])}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        buttonInputs.borderRadius.split(" ");
                      handleInputChange(
                        "borderRadius",
                        `${top} ${right} ${bottom} ${value}px`
                      );
                    }}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.border.label")}
            </label>
            <Switch
              checked={borderMoreOptions}
              onChange={(checked) => {
                setBorderMoreOptions(checked);
                const currentWidth = parseInt(
                  buttonInputs.border.borderWidth
                    ? buttonInputs.border.borderWidth.split(" ")[0]
                    : "0"
                );
                const currentColor = buttonInputs.border.borderColor
                  ? buttonInputs.border.borderColor.split(" ")[0]
                  : "transparent";
                const currentStyle = buttonInputs.border.borderStyle
                  ? buttonInputs.border.borderStyle.split(" ")[0]
                  : "none";
                if (!checked) {
                  handleInputChange("border", {
                    borderWidth: `${currentWidth}px`,
                    borderStyle: currentStyle,
                    borderColor: currentColor,
                  });
                } else {
                  handleInputChange("border", {
                    borderWidth: `${currentWidth}px ${currentWidth}px ${currentWidth}px ${currentWidth}px`,
                    borderStyle: `${currentStyle} ${currentStyle} ${currentStyle} ${currentStyle}`,
                    borderColor: `${currentColor} ${currentColor} ${currentColor} ${currentColor}`,
                  });
                }
              }}
              label={t("builder.properties.general.moreOptions")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!borderMoreOptions ? (
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("builder.properties.general.allSides")}
                </label>
                <NumberInput
                  value={parseInt(buttonInputs.border.borderWidth || "0")}
                  onChange={(value) =>
                    handleInputChange("border", `${value}px`, "borderWidth")
                  }
                  min={0}
                  max={100}
                />
                <select
                  value={buttonInputs.border.borderStyle}
                  onChange={(e) =>
                    handleInputChange("border", e.target.value, "borderStyle")
                  }
                  className="w-fit rounded-md border border-gray-300"
                >
                  {BORDER_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
                <input
                  type="color"
                  value={buttonInputs.border.borderColor}
                  onChange={(e) =>
                    handleInputChange("border", e.target.value, "borderColor")
                  }
                  className="rounded-md border border-gray-300"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.top")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      buttonInputs.border.borderWidth
                        ? buttonInputs.border.borderWidth.split(" ")[0]
                        : "0"
                    )}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        buttonInputs.border.borderWidth!.split(" ");
                      handleInputChange(
                        "border",
                        `${value}px ${right} ${bottom} ${left}`,
                        "borderWidth"
                      );
                    }}
                  />
                  <select
                    value={
                      buttonInputs.border.borderStyle
                        ? buttonInputs.border.borderStyle.split(" ")[0]
                        : "none"
                    }
                    onChange={(e) => {
                      const [_, right, bottom, left] =
                        buttonInputs.border.borderStyle!.split(" ");
                      handleInputChange(
                        "border",
                        `${e.target.value} ${right} ${bottom} ${left}`,
                        "borderStyle"
                      );
                    }}
                    className="w-fit rounded-md border border-gray-300"
                  >
                    {BORDER_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={
                      buttonInputs.border.borderColor
                        ? buttonInputs.border.borderColor.split(" ")[0]
                        : "transparent"
                    }
                    onChange={(e) => {
                      const [_, right, bottom, left] =
                        buttonInputs.border.borderColor!.split(" ");
                      handleInputChange(
                        "border",
                        `${e.target.value} ${right} ${bottom} ${left}`,
                        "borderColor"
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.right")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      buttonInputs.border.borderWidth
                        ? buttonInputs.border.borderWidth.split(" ")[1]
                        : "0"
                    )}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        buttonInputs.border.borderWidth!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${value}px ${bottom} ${left}`,
                        "borderWidth"
                      );
                    }}
                  />
                  <select
                    value={
                      buttonInputs.border.borderStyle
                        ? buttonInputs.border.borderStyle.split(" ")[1]
                        : "none"
                    }
                    onChange={(e) => {
                      const [top, _, bottom, left] =
                        buttonInputs.border.borderStyle!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${e.target.value} ${bottom} ${left}`,
                        "borderStyle"
                      );
                    }}
                    className="w-fit rounded-md border border-gray-300"
                  >
                    {BORDER_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={
                      buttonInputs.border.borderColor
                        ? buttonInputs.border.borderColor.split(" ")[1]
                        : "transparent"
                    }
                    onChange={(e) => {
                      const [top, _, bottom, left] =
                        buttonInputs.border.borderColor!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${e.target.value} ${bottom} ${left}`,
                        "borderColor"
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.bottom")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      buttonInputs.border.borderWidth
                        ? buttonInputs.border.borderWidth.split(" ")[2]
                        : "0"
                    )}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        buttonInputs.border.borderWidth!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${value}px ${left}`,
                        "borderWidth"
                      );
                    }}
                  />
                  <select
                    value={
                      buttonInputs.border.borderStyle
                        ? buttonInputs.border.borderStyle.split(" ")[2]
                        : "none"
                    }
                    onChange={(e) => {
                      const [top, right, _, left] =
                        buttonInputs.border.borderStyle!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${e.target.value} ${left}`,
                        "borderStyle"
                      );
                    }}
                    className="w-fit rounded-md border border-gray-300"
                  >
                    {BORDER_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={
                      buttonInputs.border.borderColor
                        ? buttonInputs.border.borderColor.split(" ")[2]
                        : "transparent"
                    }
                    onChange={(e) => {
                      const [top, right, _, left] =
                        buttonInputs.border.borderColor!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${e.target.value} ${left}`,
                        "borderColor"
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.positions.left")}
                  </label>
                  <NumberInput
                    value={parseInt(
                      buttonInputs.border.borderWidth
                        ? buttonInputs.border.borderWidth.split(" ")[3]
                        : "0" 
                    )}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        buttonInputs.border.borderWidth!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${bottom} ${value}px`,
                        "borderWidth"
                      );
                    }}
                  />
                  <select
                    value={
                      buttonInputs.border.borderStyle
                        ? buttonInputs.border.borderStyle.split(" ")[3]
                        : "none"
                    }
                    onChange={(e) => {
                      const [top, right, bottom, _] =
                        buttonInputs.border.borderStyle!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${bottom} ${e.target.value}`,
                        "borderStyle"
                      );
                    }}
                    className="w-fit rounded-md border border-gray-300"
                  >
                    {BORDER_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={
                      buttonInputs.border.borderColor
                        ? buttonInputs.border.borderColor.split(" ")[3]
                        : "transparent"
                    }
                    onChange={(e) => {
                      const [top, right, bottom, _] =
                        buttonInputs.border.borderColor!.split(" ");
                      handleInputChange(
                        "border",
                        `${top} ${right} ${bottom} ${e.target.value}`,
                        "borderColor"
                      );
                    }}
                  />
                </div>
              </>
            )}
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
                onChange={(checked) => {
                  setContainerMoreOptions(checked);
                  if (!checked) {
                    // Reset to single value when disabling more options
                    const currentValue = parseInt(
                      buttonInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);
                  } else {
                    const currentValue = parseInt(
                      buttonInputs.containerPadding.split(" ")[0]
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
                  value={parseInt(buttonInputs.containerPadding)}
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
                      buttonInputs.containerPadding.split(" ")[0]
                    )}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        buttonInputs.containerPadding.split(" ");
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
                      buttonInputs.containerPadding.split(" ")[1]
                    )}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        buttonInputs.containerPadding.split(" ");
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
                      buttonInputs.containerPadding.split(" ")[2]
                    )}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        buttonInputs.containerPadding.split(" ");
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
                      buttonInputs.containerPadding.split(" ")[3]
                    )}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        buttonInputs.containerPadding.split(" ");
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

export default ButtonPropertyPanel;
