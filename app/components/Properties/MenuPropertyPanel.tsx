import { useTranslation } from "react-i18next";
import type { ElementType, MenuInputs } from "~/types/template";
import {
  Bars3Icon,
  CubeTransparentIcon,
  TrashIcon,
  PlusCircleIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Collapse from "../Common/Collapse";
import Switch from "../Common/Switch";
import NumberInput from "../Common/NumberInput";
import { useEffect, useState } from "react";
import { useBuilder } from "~/hooks/useBuilder";
import type { TextAlign } from "~/types/components";
import { FONT_FAMILY_OPTIONS } from "./TextPropertyPanel";

interface MenuPropertyPanelProps {
  selectedElement: { id: string; type: ElementType };
}

const ALIGN_OPTIONS = ["left", "center", "right"] as const;

const MenuPropertyPanel: React.FC<MenuPropertyPanelProps> = ({
  selectedElement,
}) => {
  const { t } = useTranslation();
  const { template, updateContent } = useBuilder();

  const [menuInputs, setMenuInputs] = useState<MenuInputs>({
    menu: {
      items: [],
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
    textColor: "#000000",
    linkColor: "#000000",
    layout: "horizontal",
    separator: "",
    padding: "10px",
    containerPadding: "10px",
    letterSpacing: "0px",
    align: "left",
  });

  const [paddingMoreOptions, setPaddingMoreOptions] = useState(false);
  const [containerMoreOptions, setContainerMoreOptions] = useState(false);

  useEffect(() => {
    const element = template.body.rows
      .flatMap((row) => row.columns)
      .flatMap((column) => column.contents)
      .find((content) => content.id === selectedElement.id);
    if (element) {
      setMenuInputs({
        menu: {
          items: element.values.menu?.items || [],
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
        textColor: element.values.textColor || "#000000",
        linkColor: element.values.linkColor || "#000000",
        layout: element.values.layout || "horizontal",
        separator: element.values.separator || "",
        padding: element.values.padding
          ? element.values.padding.split(" ").length !== 2
            ? `${element.values.padding}`
            : `${element.values.padding} ${element.values.padding}`
          : "10px",
        containerPadding: element.values.containerPadding || "10px",
        letterSpacing: element.values.letterSpacing || "0px",
        align: (element.values.align || "left") as TextAlign,
      });
      setPaddingMoreOptions(element.values.padding?.split(" ").length! > 1);
    }
  }, [template, selectedElement]);

  const handleInputChange = (
    key: keyof MenuInputs,
    value: any,
    nestedKey?: string
  ) => {
    setMenuInputs((prev) => {
      if (nestedKey) {
        return {
          ...prev,
          [key]: {
            ...(prev[key] as any),
            [nestedKey]: value,
          },
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });

    const tempValue = nestedKey
      ? {
          [key]: {
            ...(menuInputs[key] as any),
            [nestedKey]: value,
          },
        }
      : { [key]: value };

    updateContent(selectedElement.id, tempValue);
  };

  return (
    <>
      <Collapse
        title={t("builder.properties.menu.items.label")}
        icon={<Bars3Icon className="h-5 w-5" />}
        defaultOpen
      >
        <div className="flex flex-col gap-4">
          {menuInputs.menu.items.map((item, index) => (
            <div key={index} className="border">
              <div className="flex justify-between px-4 py-2 cursor-grab items-center hover:bg-[radial-gradient(rgba(0,0,0,0.3)_1px,transparent_1px)] hover:bg-[length:10px_10px] hover:bg-white">
                <CubeTransparentIcon className="h-5 w-5" />
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white cursor-pointer"
                  onClick={() =>
                    handleInputChange(
                      "menu",
                      [
                        ...menuInputs.menu.items.filter(
                          (_item) => _item.key !== item.key
                        ),
                      ],
                      "items"
                    )
                  }
                >
                  <TrashIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="p-4 flex-col gap-2 flex">
                <div className="flex justify-between items-center">
                  <label>{t("builder.properties.menu.action.type")}</label>
                  <select
                    className="w-fit rounded-md border border-gray-300"
                    value={item.link.name}
                    onChange={(e) =>
                      handleInputChange(
                        "menu",
                        [
                          ...menuInputs.menu.items.map((_item) =>
                            _item.key === item.key
                              ? {
                                  ..._item,
                                  link: {
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
                                  },
                                }
                              : _item
                          ),
                        ],
                        "items"
                      )
                    }
                  >
                    <option value="web">
                      {t(
                        "builder.properties.actionTypeOptions.openWebsite"
                      )}
                    </option>
                    <option value="mailto">
                      {t("builder.properties.actionTypeOptions.sendEmail")}
                    </option>
                    <option value="tel">
                      {t("builder.properties.actionTypeOptions.callPhone")}
                    </option>
                  </select>
                </div>

                <div className="flex items-center border">
                  <label className="px-3">
                    {t("builder.properties.menu.action.label")}
                  </label>
                  <input
                    type="text"
                    style={{
                      borderRadius: 0,
                      border: "none",
                      borderLeft: "1px solid #CCCCCC",
                    }}
                    value={item.text}
                    onChange={(e) =>
                      handleInputChange(
                        "menu",
                        [
                          ...menuInputs.menu.items.map((_item) =>
                            _item.key === item.key
                              ? { ..._item, text: e.target.value }
                              : _item
                          ),
                        ],
                        "items"
                      )
                    }
                  />
                </div>

                {item.link.name === "web" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center border">
                      <label className="px-3">
                        {t("builder.properties.menu.action.url")}
                      </label>
                      <input
                        type="url"
                        style={{
                          borderRadius: 0,
                          border: "none",
                          borderLeft: "1px solid #CCCCCC",
                        }}
                        value={item.link.values.href}
                        onChange={(e) =>
                          handleInputChange(
                            "menu",
                            [
                              ...menuInputs.menu.items.map((_item) =>
                                _item.key === item.key
                                  ? {
                                      ..._item,
                                      link: {
                                        ..._item.link,
                                        values: {
                                          ..._item.link.values,
                                          href: e.target.value,
                                        },
                                      },
                                    }
                                  : _item
                              ),
                            ],
                            "items"
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center border">
                      <label className="px-3">
                        {t("builder.properties.menu.action.target")}
                      </label>
                      <select
                        className="rounded-none"
                        value={item.link.values.target}
                        onChange={(e) =>
                          handleInputChange(
                            "menu",
                            [
                              ...menuInputs.menu.items.map((_item) =>
                                _item.key === item.key
                                  ? {
                                      ..._item,
                                      link: {
                                        ..._item.link,
                                        values: {
                                          ..._item.link.values,
                                          target: e.target.value,
                                        },
                                      },
                                    }
                                  : _item
                              ),
                            ],
                            "items"
                          )
                        }
                      >
                        <option value="_blank">
                          {t("builder.properties.targetOptions.newTab")}
                        </option>
                        <option value="_self">
                          {t("builder.properties.targetOptions.sameTab")}
                        </option>
                      </select>
                    </div>
                  </div>
                ) : item.link.name === "mailto" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center border">
                      <label className="px-3">
                        {t("builder.properties.menu.action.email.to")}
                      </label>
                      <input
                        type="url"
                        style={{
                          borderRadius: 0,
                          border: "none",
                          borderLeft: "1px solid #CCCCCC",
                          flex: 1,
                        }}
                        value={item.link.values.mailto}
                        onChange={(e) =>
                          handleInputChange(
                            "menu",
                            [
                              ...menuInputs.menu.items.map((_item) =>
                                _item.key === item.key
                                  ? {
                                      ..._item,
                                      link: {
                                        ..._item.link,
                                        values: {
                                          ..._item.link.values,
                                          mailto: e.target.value,
                                        },
                                      },
                                    }
                                  : _item
                              ),
                            ],
                            "items"
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center border">
                      <label className="px-3">
                        {t("builder.properties.menu.action.email.subject")}
                      </label>
                      <input
                        type="text"
                        style={{
                          borderRadius: 0,
                          border: "none",
                          borderLeft: "1px solid #CCCCCC",
                        }}
                        value={item.link.values.subject}
                        onChange={(e) =>
                          handleInputChange(
                            "menu",
                            [
                              ...menuInputs.menu.items.map((_item) =>
                                _item.key === item.key
                                  ? {
                                      ..._item,
                                      link: {
                                        ..._item.link,
                                        values: {
                                          ..._item.link.values,
                                          subject: e.target.value,
                                        },
                                      },
                                    }
                                  : _item
                              ),
                            ],
                            "items"
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center border">
                      <label className="px-3">
                        {t("builder.properties.menu.action.email.body")}
                      </label>
                      <textarea
                        style={{
                          borderRadius: 0,
                          border: "none",
                          borderLeft: "1px solid #CCCCCC",
                        }}
                        value={item.link.values.body}
                        rows={5}
                        onChange={(e) =>
                          handleInputChange(
                            "menu",
                            [
                              ...menuInputs.menu.items.map((_item) =>
                                _item.key === item.key
                                  ? {
                                      ..._item,
                                      link: {
                                        ..._item.link,
                                        values: {
                                          ..._item.link.values,
                                          body: e.target.value,
                                        },
                                      },
                                    }
                                  : _item
                              ),
                            ],
                            "items"
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center border">
                    <label className="px-3">
                      {t("builder.properties.menu.action.phone")}
                    </label>
                    <input
                      type="text"
                      style={{
                        borderRadius: 0,
                        border: "none",
                        borderLeft: "1px solid #CCCCCC",
                        flex: 1,
                      }}
                      value={item.link.values.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "menu",
                          [
                            ...menuInputs.menu.items.map((_item) =>
                              _item.key === item.key
                                ? {
                                    ..._item,
                                    link: {
                                      ..._item.link,
                                      values: {
                                        ..._item.link.values,
                                        phone: e.target.value,
                                      },
                                    },
                                  }
                                : _item
                            ),
                          ],
                          "items"
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            className="flex justify-center items-center gap-2 py-6"
            onClick={() =>
              handleInputChange(
                "menu",
                [
                  ...menuInputs.menu.items,
                  {
                    key: crypto.randomUUID(),
                    text: "",
                    link: {
                      name: "web",
                      values: { href: "", target: "_blank" },
                    },
                  },
                ],
                "items"
              )
            }
          >
            <PlusCircleIcon className="h-5 w-5" />
            <p>{t("builder.properties.menu.items.add")}</p>
          </button>
        </div>
      </Collapse>

      <Collapse
        title={t("builder.properties.menu.styles.label")}
        icon={<PaintBrushIcon className="h-5 w-5" />}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.font.family")}
            </label>
            <select
              value={menuInputs.fontFamily?.value}
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
                fontWeight: menuInputs.fontWeight,
              }}
              value={menuInputs.fontWeight}
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
              value={parseInt(menuInputs.fontSize)}
              onChange={(value) => handleInputChange("fontSize", `${value}px`)}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("builder.properties.sharedStyles.font.letterSpacing")}
            </label>
            <NumberInput
              value={Number(parseFloat(menuInputs.letterSpacing).toFixed(1))}
              onChange={(value) => handleInputChange("letterSpacing", value)}
              step={0.1}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.menu.styles.colors.text")}
            </label>
            <input
              type="color"
              value={menuInputs.textColor}
              onChange={(e) => handleInputChange("textColor", e.target.value)}
              className="rounded-md border border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.menu.styles.colors.link")}
            </label>
            <input
              type="color"
              value={menuInputs.linkColor}
              onChange={(e) => handleInputChange("linkColor", e.target.value)}
              className="rounded-md border border-gray-300"
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {t("builder.properties.sharedStyles.alignment.label")}
            </label>
            <div className="flex gap-2">
              {ALIGN_OPTIONS.map((align) => (
                <button
                  key={align}
                  onClick={() => handleInputChange("align", align)}
                  className={`p-2 hover:bg-gray-100 rounded ${
                    menuInputs.align === align ? "bg-gray-200" : ""
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
              {t("builder.properties.sharedStyles.layout")}
            </label>
            <select
              value={menuInputs.layout}
              onChange={(e) => handleInputChange("layout", e.target.value)}
              className="w-fit"
            >
              <option value="horizontal">
                {t("builder.properties.layoutOptions.horizontal")}
              </option>
              <option value="vertical">
                {t("builder.properties.layoutOptions.vertical")}
              </option>
            </select>
          </div>

          {menuInputs.layout == "horizontal" && (
            <>
              <hr className="my-4" />

              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  {t("builder.properties.menu.separator")}
                </label>
                <input
                  type="text"
                  value={menuInputs.separator || ""}
                  onChange={(e) => handleInputChange("separator", e.target.value)}
                  className="rounded-md border border-gray-300"
                  style={{
                    width: "150px"
                  }}
                />
              </div>
            </>
          )}
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
                  menuInputs.padding.split(" ")[0]
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
                value={parseInt(menuInputs.padding)}
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
                  value={parseInt(menuInputs.padding.split(" ")[0])}
                  onChange={(value) => {
                    const [_, right, bottom, left] =
                      menuInputs.padding.split(" ");
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
                  value={parseInt(menuInputs.padding.split(" ")[1])}
                  onChange={(value) => {
                    const [top, _, bottom, left] =
                      menuInputs.padding.split(" ");
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
                  value={parseInt(menuInputs.padding.split(" ")[2])}
                  onChange={(value) => {
                    const [top, right, _, left] =
                      menuInputs.padding.split(" ");

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
                  value={parseInt(menuInputs.padding.split(" ")[3])}
                  onChange={(value) => {
                    const [top, right, bottom, _] =
                      menuInputs.padding.split(" ");
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
                      menuInputs.containerPadding.split(" ")[0]
                    );
                    handleInputChange("containerPadding", `${currentValue}px`);
                  } else {
                    const currentValue = parseInt(
                      menuInputs.containerPadding.split(" ")[0]
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
                  value={parseInt(menuInputs.containerPadding)}
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
                      menuInputs.containerPadding.split(" ")[0]
                    )}
                    onChange={(value) => {
                      const [_, right, bottom, left] =
                        menuInputs.containerPadding.split(" ");
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
                      menuInputs.containerPadding.split(" ")[1]
                    )}
                    onChange={(value) => {
                      const [top, _, bottom, left] =
                        menuInputs.containerPadding.split(" ");
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
                      menuInputs.containerPadding.split(" ")[2]
                    )}
                    onChange={(value) => {
                      const [top, right, _, left] =
                        menuInputs.containerPadding.split(" ");
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
                      menuInputs.containerPadding.split(" ")[3]
                    )}
                    onChange={(value) => {
                      const [top, right, bottom, _] =
                        menuInputs.containerPadding.split(" ");
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

export default MenuPropertyPanel;
