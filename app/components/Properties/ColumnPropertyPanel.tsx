import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ElementType, Row, Column } from "../../types/template";
import { v4 as uuidv4 } from "uuid";
import { useBuilder } from "../../hooks/useBuilder";
import Collapse from "../Common/Collapse";
import NumberInput from "../Common/NumberInput";
import Switch from "../Common/Switch";
import { QueueListIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";

interface ColumnPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

const BORDER_STYLES = ["none", "solid", "dashed", "dotted", "double"];

const LAYOUT_CONFIGS = [
  { id: "100", cells: [1], tooltip: "100%" },
  { id: "50-50", cells: [1, 1], tooltip: "50% 50%" },
  { id: "33-33-33", cells: [1, 1, 1], tooltip: "33% 33% 33%" },
  { id: "25-25-25-25", cells: [1, 1, 1, 1], tooltip: "25% 25% 25% 25%" },
  { id: "33-67", cells: [1, 2], tooltip: "33% 67%" },
  { id: "67-33", cells: [2, 1], tooltip: "67% 33%" },
  { id: "17-33-17-33", cells: [1, 2, 1, 2], tooltip: "17% 33% 17% 33%" },
  { id: "33-17-33-17", cells: [2, 1, 2, 1], tooltip: "33% 17% 33% 17%" },
];

interface BorderInputState {
  [key: string]: string; // Format: "columnIndex-side-property"
}

interface PaddingInputState {
  [key: string]: string; // Format: "columnIndex-padding"
}

interface RowInputState {
  backgroundColor: string;
  padding: string;
  columnsBackgroundColor: string;
  backgroundImage: {
    url: string;
    fullWidth: boolean;
    repeat: string;
    size: string;
    position: string;
    width?: number;
    height?: number;
  };
}

const BACKGROUND_REPEAT_OPTIONS = [
  "no-repeat",
  "repeat",
  "repeat-x",
  "repeat-y",
];

const BACKGROUND_SIZE_OPTIONS = ["auto", "cover", "contain"];

const BACKGROUND_POSITION_OPTIONS = [
  "center center",
  "top left",
  "top center",
  "top right",
  "center left",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right",
];

const ColumnPropertyPanel: React.FC<ColumnPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateRow } = useBuilder();
  const [currentElement, setCurrentElement] = useState<Row | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [rowInputs, setRowInputs] = useState<RowInputState>({
    backgroundColor: "",
    padding: "",
    columnsBackgroundColor: "",
    backgroundImage: {
      url: "",
      fullWidth: false,
      repeat: "no-repeat",
      size: "cover",
      position: "center center",
      width: undefined,
      height: undefined,
    },
  });
  const [borderMoreOptions, setBorderMoreOptions] = useState(false);
  const [paddingMoreOptions, setPaddingMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows.find(
      (row) => row.id === selectedElement.id
    );
    setSelectedColumnIndex(0);
    setCurrentElement(element || null);

    // Initialize all input states
    if (element) {
      const newBorderInputs: BorderInputState = {};
      const newPaddingInputs: PaddingInputState = {};

      element.columns.forEach((column, colIndex) => {
        // Initialize padding inputs
        newPaddingInputs[`${colIndex}-padding`] = column.values.padding || "";

        // Initialize border inputs
        ["Top", "Right", "Bottom", "Left"].forEach((side) => {
          ["Width", "Style", "Color"].forEach((prop) => {
            const key = `${colIndex}-${side}-${prop}`;
            const value =
              column.values.border?.[
                `border${side}${prop}` as keyof typeof column.values.border
              ] || "";
            newBorderInputs[key] = value;
          });
        });
      });

      // Initialize row inputs
      setRowInputs({
        backgroundColor: element.values.backgroundColor || "",
        padding: element.values.padding || "",
        columnsBackgroundColor: element.values.columnsBackgroundColor || "",
        backgroundImage: {
          url: element.values.backgroundImage?.url || "",
          fullWidth: element.values.backgroundImage?.fullWidth || false,
          repeat: element.values.backgroundImage?.repeat || "no-repeat",
          size: element.values.backgroundImage?.size || "cover",
          position: element.values.backgroundImage?.position || "center center",
          width: element.values.backgroundImage?.width,
          height: element.values.backgroundImage?.height,
        },
      });
    }
  }, [selectedElement]);

  useEffect(() => {
    const element = template.body.rows.find(
      (row) => row.id === selectedElement.id
    );
    setCurrentElement(element || null);
  }, [template]);

  const handleLayoutChange = (cells: number[]) => {
    if (!currentElement) return;

    const newColumns =
      currentElement.columns.length < cells.length
        ? [
            ...currentElement.columns,
            ...Array.from({
              length: cells.length - currentElement.columns.length,
            }).map(() => ({
              id: uuidv4(),
              contents: [],
              values: {
                backgroundColor: "",
                padding: "20px",
                border: {},
                borderRadius: "0px",
                _meta: {
                  htmlID: "",
                  htmlClassNames: "",
                },
              },
            })),
          ]
        : currentElement.columns.slice(0, cells.length);

    updateRow(currentElement.id, {
      cells,
      columns: newColumns,
    });
  };

  const currentLayout = LAYOUT_CONFIGS.find(
    (config) =>
      config.cells.length === currentElement?.cells.length &&
      config.cells.every((cell, index) => cell === currentElement?.cells[index])
  );

  const handleColumnValueChange = (
    columnIndex: number,
    key: keyof Column["values"],
    value: any
  ) => {
    if (!currentElement) return;

    const updatedColumns = currentElement.columns.map((col, idx) =>
      idx === columnIndex
        ? {
            ...col,
            values: {
              ...col.values,
              [key]: value,
            },
          }
        : col
    );

    updateRow(currentElement.id, {
      columns: updatedColumns,
    });
  };

  const handleRowInputChange = (
    property: keyof RowInputState,
    value: string
  ) => {
    setRowInputs((prev) => ({
      ...prev,
      [property]: value,
    }));

    if (!currentElement) return;

    updateRow(currentElement.id, {
      values: {
        ...currentElement.values,
        [property]: rowInputs[property],
      },
    });
  };

  const handleBackgroundImageChange = (
    property: keyof RowInputState["backgroundImage"],
    value: string | boolean | number | undefined
  ) => {
    setRowInputs((prev) => ({
      ...prev,
      backgroundImage: {
        ...prev.backgroundImage,
        [property]: value,
      },
    }));

    if (!currentElement) return;

    updateRow(currentElement.id, {
      values: {
        ...currentElement.values,
        backgroundImage: rowInputs.backgroundImage,
      },
    });
  };

  return (
    <>
      <Collapse
        title={t("builder.properties.column.columns")}
        icon={<ViewColumnsIcon className="w-5 h-5" />}
        defaultOpen
      >
        <div className="grid grid-cols-2 gap-2">
          {LAYOUT_CONFIGS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              title={layout.tooltip}
              onClick={() => handleLayoutChange(layout.cells)}
              className={`
                p-2 text-xs border rounded-md transition-all
                hover:border-blue-500 hover:bg-blue-50
                ${
                  currentLayout?.id === layout.id
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600"
                }
              `}
            >
              <div className="flex gap-0.5">
                {layout.cells.map((cell, index) => (
                  <div
                    key={index}
                    className="h-8 bg-gray-200 text-gray-600 flex items-center justify-center"
                    style={{
                      flex: cell,
                      marginLeft: index > 0 ? "2px" : "0",
                    }}
                  >
                    {(
                      (100 / layout.cells.reduce((a, b) => a + b, 0)) *
                      cell
                    ).toFixed(0)}
                    %
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Collapse>

      <Collapse
        title={t("builder.properties.column.columnValues")}
        icon={<ViewColumnsIcon className="w-5 h-5" />}
        defaultOpen
      >
        {currentElement && currentElement.columns.length > 0 && (
          <>
            <div className="flex border-b gap-2 border-gray-200 mb-4">
              {currentElement.columns.map((_, index) => (
                <button
                  key={index}
                  className={`
                    py-2 text-[10px] font-medium
                    ${
                      selectedColumnIndex === index
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                  onClick={() => setSelectedColumnIndex(index)}
                >
                  {t("builder.components.column.label")} {index + 1}
                </button>
              ))}
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-2 justify-between items-center">
                <label className="block font-medium text-gray-700">
                  {t("builder.properties.column.backgroundColor")}
                </label>
                <input
                  type="color"
                  value={
                    currentElement.columns[selectedColumnIndex].values
                      .backgroundColor
                  }
                  onChange={(e) =>
                    handleColumnValueChange(
                      selectedColumnIndex,
                      "backgroundColor",
                      e.target.value
                    )
                  }
                  className="w-12 rounded-md border-gray-300"
                />
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
                        currentElement.columns[
                          selectedColumnIndex
                        ].values.padding.split(" ")[0]
                      );

                      if (!checked) {
                        // Reset to single value when disabling more options
                        handleColumnValueChange(
                          selectedColumnIndex,
                          "padding",
                          `${currentValue}px`
                        );
                      } else {
                        handleColumnValueChange(
                          selectedColumnIndex,
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
                      value={parseInt(
                        currentElement.columns[selectedColumnIndex].values
                          .padding
                      )}
                      onChange={(value) =>
                        handleColumnValueChange(
                          selectedColumnIndex,
                          "padding",
                          `${value}px`
                        )
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
                          currentElement.columns[
                            selectedColumnIndex
                          ].values.padding.split(" ")[0]
                        )}
                        onChange={(value) => {
                          const [_, right, bottom, left] =
                            currentElement.columns[
                              selectedColumnIndex
                            ].values.padding.split(" ");
                          handleColumnValueChange(
                            selectedColumnIndex,
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
                        value={parseInt(
                          currentElement.columns[
                            selectedColumnIndex
                          ].values.padding.split(" ")[1]
                        )}
                        onChange={(value) => {
                          const [top, _, bottom, left] =
                            currentElement.columns[
                              selectedColumnIndex
                            ].values.padding.split(" ");
                          handleColumnValueChange(
                            selectedColumnIndex,
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
                        value={parseInt(
                          currentElement.columns[
                            selectedColumnIndex
                          ].values.padding.split(" ")[2]
                        )}
                        onChange={(value) => {
                          const [top, right, _, left] =
                            currentElement.columns[
                              selectedColumnIndex
                            ].values.padding.split(" ");

                          handleColumnValueChange(
                            selectedColumnIndex,
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
                        value={parseInt(
                          currentElement.columns[
                            selectedColumnIndex
                          ].values.padding.split(" ")[3]
                        )}
                        onChange={(value) => {
                          const [top, right, bottom, _] =
                            currentElement.columns[
                              selectedColumnIndex
                            ].values.padding.split(" ");
                          handleColumnValueChange(
                            selectedColumnIndex,
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("builder.properties.sharedStyles.border.label")}
                  </label>
                  <Switch
                    checked={borderMoreOptions}
                    onChange={(checked) => {
                      setBorderMoreOptions(checked);
                      const currentWidth = parseInt(
                        currentElement.columns[selectedColumnIndex].values
                          .border.borderTopWidth
                          ? currentElement.columns[
                              selectedColumnIndex
                            ].values.border.borderTopWidth.split(" ")[0]
                          : "0"
                      );
                      const currentColor = currentElement.columns[
                        selectedColumnIndex
                      ].values.border.borderTopColor
                        ? currentElement.columns[
                            selectedColumnIndex
                          ].values.border.borderTopColor.split(" ")[0]
                        : "transparent";
                      const currentStyle = currentElement.columns[
                        selectedColumnIndex
                      ].values.border.borderTopStyle
                        ? currentElement.columns[
                            selectedColumnIndex
                          ].values.border.borderTopStyle.split(" ")[0]
                        : "none";
                      if (!checked) {
                        handleColumnValueChange(selectedColumnIndex, "border", {
                          borderTopWidth: `${currentWidth}px`,
                          borderTopStyle: currentStyle,
                          borderTopColor: currentColor,
                          borderBottomWidth: `${currentWidth}px`,
                          borderBottomStyle: currentStyle,
                          borderBottomColor: currentColor,
                          borderLeftWidth: `${currentWidth}px`,
                          borderLeftStyle: currentStyle,
                          borderLeftColor: currentColor,
                          borderRightWidth: `${currentWidth}px`,
                          borderRightStyle: currentStyle,
                          borderRightColor: currentColor,
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
                        value={parseInt(
                          currentElement.columns[selectedColumnIndex].values
                            .border.borderTopWidth || "0"
                        )}
                        onChange={(value) =>
                          handleColumnValueChange(
                            selectedColumnIndex,
                            "border",
                            {
                              ...currentElement.columns[selectedColumnIndex]
                                .values.border,
                              borderTopWidth: `${value}px`,
                              borderBottomWidth: `${value}px`,
                              borderLeftWidth: `${value}px`,
                              borderRightWidth: `${value}px`,
                            }
                          )
                        }
                      />
                      <select
                        value={
                          currentElement.columns[selectedColumnIndex].values
                            .border.borderTopStyle
                        }
                        onChange={(e) =>
                          handleColumnValueChange(
                            selectedColumnIndex,
                            "border",
                            {
                              ...currentElement.columns[selectedColumnIndex]
                                .values.border,
                              borderTopStyle: e.target.value,
                              borderBottomStyle: e.target.value,
                              borderLeftStyle: e.target.value,
                              borderRightStyle: e.target.value,
                            }
                          )
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
                        value={
                          currentElement.columns[selectedColumnIndex].values
                            .border.borderTopColor
                        }
                        onChange={(e) =>
                          handleColumnValueChange(
                            selectedColumnIndex,
                            "border",
                            {
                              ...currentElement.columns[selectedColumnIndex]
                                .values.border,
                              borderTopColor: e.target.value,
                              borderBottomColor: e.target.value,
                              borderLeftColor: e.target.value,
                              borderRightColor: e.target.value,
                            }
                          )
                        }
                        className="rounded-md border border-gray-300"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t(
                            "builder.properties.sharedStyles.border.positions.top"
                          )}
                        </label>
                        <NumberInput
                          value={parseInt(
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderTopWidth || "0"
                          )}
                          onChange={(value) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderTopWidth: `${value}px`,
                              }
                            )
                          }
                        />
                        <select
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderTopStyle
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderTopStyle: e.target.value,
                              }
                            )
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
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderTopColor
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderTopColor: e.target.value,
                              }
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t(
                            "builder.properties.sharedStyles.border.positions.right"
                          )}
                        </label>
                        <NumberInput
                          value={parseInt(
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderRightWidth || "0"
                          )}
                          onChange={(value) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderRightWidth: `${value}px`,
                              }
                            )
                          }
                        />
                        <select
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderRightStyle
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderRightStyle: e.target.value,
                              }
                            )
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
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderRightColor
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderRightColor: e.target.value,
                              }
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t(
                            "builder.properties.sharedStyles.border.positions.bottom"
                          )}
                        </label>
                        <NumberInput
                          value={parseInt(
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderBottomWidth || "0"
                          )}
                          onChange={(value) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderBottomWidth: `${value}px`,
                              }
                            )
                          }
                        />
                        <select
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderBottomStyle
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderBottomStyle: e.target.value,
                              }
                            )
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
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderBottomColor
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderBottomColor: e.target.value,
                              }
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t(
                            "builder.properties.sharedStyles.border.positions.left"
                          )}
                        </label>
                        <NumberInput
                          value={parseInt(
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderLeftWidth || "0"
                          )}
                          onChange={(value) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderLeftWidth: `${value}px`,
                              }
                            )
                          }
                        />
                        <select
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderLeftStyle
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderLeftStyle: e.target.value,
                              }
                            )
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
                          value={
                            currentElement.columns[selectedColumnIndex].values
                              .border.borderLeftColor
                          }
                          onChange={(e) =>
                            handleColumnValueChange(
                              selectedColumnIndex,
                              "border",
                              {
                                ...currentElement.columns[selectedColumnIndex]
                                  .values.border,
                                borderLeftColor: e.target.value,
                              }
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Collapse>

      <Collapse
        title={t("builder.properties.row.title")}
        icon={<QueueListIcon className="w-5 h-5" />}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.row.backgroundColor")}
            </label>
            <input
              type="color"
              value={rowInputs.backgroundColor}
              onChange={(e) =>
                handleRowInputChange("backgroundColor", e.target.value)
              }
              className="w-12 rounded-md border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.row.columnsBackgroundColor")}
            </label>
            <input
              type="color"
              value={rowInputs.columnsBackgroundColor}
              onChange={(e) =>
                handleRowInputChange("columnsBackgroundColor", e.target.value)
              }
              className="w-12 rounded-md border-gray-300"
            />
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
                    rowInputs.padding.split(" ")[0]
                  );

                  if (!checked) {
                    // Reset to single value when disabling more options
                    handleRowInputChange("padding", `${currentValue}px`);
                  } else {
                    handleRowInputChange(
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
                  value={parseInt(rowInputs.padding)}
                  onChange={(value) =>
                    handleRowInputChange("padding", `${value}px`)
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
                    value={parseInt(rowInputs.padding.split(" ")[0])}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        rowInputs.padding.split(" ");
                      handleRowInputChange(
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
                    value={parseInt(rowInputs.padding.split(" ")[1])}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        rowInputs.padding.split(" ");
                      handleRowInputChange(
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
                    value={parseInt(rowInputs.padding.split(" ")[2])}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        rowInputs.padding.split(" ");

                      handleRowInputChange(
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
                    value={parseInt(rowInputs.padding.split(" ")[3])}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        rowInputs.padding.split(" ");
                      handleRowInputChange(
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

          <div className="space-y-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.row.backgroundImage.label")}
            </label>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("builder.properties.row.backgroundImage.url")}
              </label>
              <input
                type="text"
                value={rowInputs.backgroundImage.url}
                onChange={(e) =>
                  handleBackgroundImageChange("url", e.target.value)
                }
                className="w-full rounded-md border border-gray-300"
                placeholder="https://"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("builder.properties.row.backgroundImage.repeat")}
              </label>
              <select
                value={rowInputs.backgroundImage.repeat}
                onChange={(e) =>
                  handleBackgroundImageChange("repeat", e.target.value)
                }
                className="w-full rounded-md border border-gray-300"
              >
                {BACKGROUND_REPEAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("builder.properties.row.backgroundImage.size")}
              </label>
              <select
                value={rowInputs.backgroundImage.size}
                onChange={(e) =>
                  handleBackgroundImageChange("size", e.target.value)
                }
                className="w-full rounded-md border border-gray-300"
              >
                {BACKGROUND_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("builder.properties.row.backgroundImage.position")}
              </label>
              <select
                value={rowInputs.backgroundImage.position}
                onChange={(e) =>
                  handleBackgroundImageChange("position", e.target.value)
                }
                className="w-full rounded-md border border-gray-300"
              >
                {BACKGROUND_POSITION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default ColumnPropertyPanel;
