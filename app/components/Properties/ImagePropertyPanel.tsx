import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ElementType } from "../../types/template";
import { useBuilder } from "../../hooks/useBuilder";
import Collapse from "../Common/Collapse";
import Switch from "../Common/Switch";
import { PhotoIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import NumberInput from "../Common/NumberInput";

interface ImagePropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

interface ImageInputState {
  src: {
    url: string;
    width?: number;
    height?: number;
    autoWidth?: boolean;
    maxWidth?: string;
  };
  altText: string;
  href: {
    url: string;
    target: string;
  };
  containerPadding: string;
  textAlign: string;
}

const ALIGN_OPTIONS = ["left", "center", "right"];
const TARGET_OPTIONS = [
  { value: "_blank", label: "New Window" },
  { value: "_self", label: "Same Window" },
];

const ImagePropertyPanel: React.FC<ImagePropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();
  const [moreOptions, setMoreOptions] = useState(false);
  const [imageInputs, setImageInputs] = useState<ImageInputState>({
    src: {
      url: "",
      width: undefined,
      height: undefined,
      autoWidth: true,
      maxWidth: "100%",
    },
    altText: "",
    href: {
      url: "",
      target: "_blank",
    },
    containerPadding: "10px",
    textAlign: "center",
  });

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);

    if (element && element.values) {
      setImageInputs({
        src: {
          url: element.values.src?.url || "",
          autoWidth: element.values.src?.autoWidth ?? true,
          maxWidth: element.values.src?.maxWidth || "100%",
          width: element.values.src?.width || undefined,
          height: element.values.src?.height || undefined,
        },
        altText: element.values.altText || "",
        href: {
          url: element.values.href?.values?.href || "",
          target: element.values.href?.values?.target || "_blank",
        },
        containerPadding: element.values.containerPadding || "10px",
        textAlign: element.values.textAlign || "center",
      });
    }
  }, [selectedElement]);

  const handleInputChange = (
    property: string,
    value: any,
    nestedProperty?: string
  ) => {
    setImageInputs((prev) => {
      if (nestedProperty) {
        return {
          ...prev,
          [property]: {
            ...(prev[property as keyof ImageInputState] as any),
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
            ...(imageInputs[property as keyof ImageInputState] as any),
            [nestedProperty]: value,
          },
        }
      : { [property]: value };
    updateContent(selectedElement.id, tempValue);
  };

  return (
    <>
      <Collapse
        icon={<PhotoIcon className="h-5 w-5" />}
        title={t("builder.properties.image.source")}
        defaultOpen
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.image.url")}
            </label>
            <input
              type="url"
              value={imageInputs.src.url}
              onChange={(e) => handleInputChange("src", e.target.value, "url")}
              className="w-full rounded-md border border-gray-300"
              placeholder="https://"
            />
          </div>

          <hr className="my-4" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.image.altText")}
            </label>
            <input
              type="text"
              value={imageInputs.altText}
              onChange={(e) => handleInputChange("altText", e.target.value)}
              className="w-full rounded-md border border-gray-300"
              placeholder="Alternative text"
            />
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.width")}
            </label>
            <Switch
              label={
                imageInputs.src.autoWidth
                  ? t("builder.properties.image.auto.on")
                  : t("builder.properties.image.auto.off")
              }
              checked={imageInputs.src.autoWidth ?? false}
              onChange={(checked) =>
                handleInputChange("src", checked, "autoWidth")
              }
            />
          </div>

          {!imageInputs.src.autoWidth && (
            <div className="flex items-center justify-between gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={parseInt(imageInputs.src.maxWidth || "100")}
                onChange={(e) =>
                  handleInputChange("src", `${e.target.value}%`, "maxWidth")
                }
                className="flex-1"
              />
              <span className="ml-2 text-gray-500">
                {imageInputs.src.maxWidth}
              </span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.alignment.label")}
            </label>
            <div className="flex gap-2">
              {ALIGN_OPTIONS.map((align) => (
                <button
                  key={align}
                  onClick={() => handleInputChange("textAlign", align)}
                  className={`p-2 hover:bg-gray-100 rounded ${
                    imageInputs.textAlign === align ? "bg-gray-200" : ""
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
                checked={moreOptions}
                onChange={(checked) => {
                  setMoreOptions(checked);
                  if (!checked) {
                    // Reset to single value when disabling more options
                    const currentValue = parseInt(
                      imageInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);
                  } else {
                    const currentValue = parseInt(
                      imageInputs.containerPadding.split(" ")[0]
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
                  value={parseInt(imageInputs.containerPadding)}
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
                    value={parseInt(imageInputs.containerPadding.split(" ")[0])}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        imageInputs.containerPadding.split(" ");
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
                      parseInt(imageInputs.containerPadding.split(" ")[1])
                    }
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        imageInputs.containerPadding.split(" ");
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
                      parseInt(imageInputs.containerPadding.split(" ")[2])
                    }
                    onChange={(value) => {
                      const [top, right, _, left] =
                        imageInputs.containerPadding.split(" ");

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
                      parseInt(imageInputs.containerPadding.split(" ")[3])
                    }

                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        imageInputs.containerPadding.split(" ");
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

export default ImagePropertyPanel;
