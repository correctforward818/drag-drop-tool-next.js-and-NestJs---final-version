import React, { useEffect, useRef, useState } from "react";
import type { Content, ElementType } from "../types/template";
import type { TextAlign } from "~/types/components";
import { useDrag, useDrop, type DropTargetMonitor } from "react-dnd";
import { useBuilder } from "~/hooks/useBuilder";
import { v4 as uuidv4 } from "uuid";
import ConfirmDialog from "./Common/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ContentRendererProps {
  content: Content;
  index: number;
  columnId: string;
  isPreviewMode: boolean;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  index,
  columnId,
  isPreviewMode,
}) => {
  const {
    addContent,
    setSelectedElement,
    selectedElement,
    updateContent,
    deleteContent,
  } = useBuilder();
  const { t } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const isBeforeRef = useRef(false);
  const currentIndex = useRef(index);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    currentIndex.current = index;
  }, [index]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [
        "text",
        "button",
        "image",
        "divider",
        "menu",
        "social",
        "heading",
      ],
      canDrop: (item, monitor) => {
        return monitor.isOver({ shallow: true });
      },
      hover: (
        item: {
          type: ElementType;
          content: any;
          columnId?: string;
          currentIndex?: number;
        },
        monitor
      ) => {
        const clientOffset = monitor.getClientOffset();
        const hoverBoundingRect = contentRef.current?.getBoundingClientRect();

        if (!clientOffset || !hoverBoundingRect) return;

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const isBefore = clientOffset.y < hoverBoundingRect.top + hoverMiddleY;

        isBeforeRef.current = isBefore;
      },
      drop: (
        item: {
          type: ElementType;
          content: any;
          columnId?: string;
          currentIndex?: number;
        },
        monitor: DropTargetMonitor
      ) => {
        const clientOffset = monitor.getClientOffset();
        const hoverBoundingRect = contentRef.current?.getBoundingClientRect();

        if (!clientOffset || !hoverBoundingRect) return;

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const isBefore = clientOffset.y < hoverBoundingRect.top + hoverMiddleY;

        // Here you would implement your content insertion logic
        // Similar to insertRow in Row.tsx, but for content
        if (item.content.id) {
          deleteContent(item.content.id);
        }
        addContent(
          columnId,
          {
            ...item.content,
            id: item.content.id ? item.content.id : uuidv4(),
          },
          isBefore
            ? columnId === item.columnId
              ? item.currentIndex! >= currentIndex.current
                ? currentIndex.current
                : currentIndex.current - 1
              : currentIndex.current
            : columnId === item.columnId
              ? item.currentIndex! >= currentIndex.current
                ? currentIndex.current + 1
                : currentIndex.current
              : currentIndex.current + 1
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  const [{ isDragging }, drag] = useDrag(() => ({
    type: content.type,
    item: {
      type: content.type,
      content,
      columnId,
      currentIndex: currentIndex.current,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Combine refs
  const combineRefs = (el: HTMLDivElement) => {
    contentRef.current = el;
    drop(el);
  };

  const saveCaretPosition = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return {
      offset: preCaretRange.toString().length,
      text: element.innerHTML,
    };
  };

  const restoreCaretPosition = (
    element: HTMLElement,
    savedCaret: { offset: number; text: string } | null
  ) => {
    if (!savedCaret || element.innerHTML !== savedCaret.text) return;

    const selection = window.getSelection();
    const range = document.createRange();

    let currentOffset = 0;
    let targetFound = false;

    const traverseNodes = (node: Node) => {
      if (targetFound) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const nodeLength = node.textContent?.length || 0;
        if (currentOffset + nodeLength >= savedCaret.offset) {
          range.setStart(node, savedCaret.offset - currentOffset);
          range.setEnd(node, savedCaret.offset - currentOffset);
          targetFound = true;
        }
        currentOffset += nodeLength;
      } else {
        for (const childNode of Array.from(node.childNodes)) {
          traverseNodes(childNode);
        }
      }
    };

    traverseNodes(element);

    if (selection && targetFound) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;

    const savedCaret = saveCaretPosition(contentRef.current);
    const newText = e.currentTarget.innerHTML;

    updateContent(content.id, {
      text: newText,
    });

    // Ensure the content is updated before restoring caret
    requestAnimationFrame(() => {
      if (contentRef.current) {
        restoreCaretPosition(contentRef.current, savedCaret);
      }
    });
  };

  const handleMouseUp = () => {
    if (contentRef.current) {
      const savedCaret = saveCaretPosition(contentRef.current);
      requestAnimationFrame(() => {
        if (contentRef.current) {
          restoreCaretPosition(contentRef.current, savedCaret);
        }
      });
    }
  };

  const handleDelete = () => {
    setSelectedElement(null);
    deleteContent(content.id);
    toast.error(t("builder.toast.deleteSuccess"));
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    addContent(
      columnId,
      { ...content, id: uuidv4() },
      currentIndex.current + 1
    );
    toast.success(t("builder.toast.duplicateSuccess"));
  };

  const renderContent = () => {
    switch (content.type) {
      case "text":
        return !isPreviewMode ? (
          <div
            ref={contentRef}
            contentEditable={selectedElement?.id === content.id}
            onInput={handleTextChange}
            onMouseUp={handleMouseUp}
            suppressContentEditableWarning={true}
            style={{
              fontFamily: content.values.fontFamily?.value,
              fontSize: content.values.fontSize,
              fontWeight: content.values.fontWeight,
              lineHeight: content.values.lineHeight,
              letterSpacing: content.values.letterSpacing,
              textAlign: content.values.textAlign as TextAlign,
              color: content.values.color || "white",
              padding: content.values.containerPadding,
              border:
                selectedElement?.id === content.id
                  ? "1px solid rgb(96 165 250)"
                  : "none",
            }}
            dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
          />
        ) : (
          <div
            style={{
              fontFamily: content.values.fontFamily?.value,
              fontSize: content.values.fontSize,
              fontWeight: content.values.fontWeight,
              lineHeight: content.values.lineHeight,
              letterSpacing: content.values.letterSpacing,
              textAlign: content.values.textAlign as TextAlign,
              color: content.values.color || "white",
              padding: content.values.containerPadding,
              border:
                selectedElement?.id === content.id
                  ? "1px solid rgb(96 165 250)"
                  : "none",
            }}
            dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
          />
        );
      case "button":
        return !isPreviewMode ? (
          <div
            style={{
              padding: content.values.containerPadding,
              textAlign: content.values.textAlign as TextAlign,
            }}
            contentEditable={selectedElement?.id === content.id}
            onInput={handleTextChange}
            onMouseUp={handleMouseUp}
            suppressContentEditableWarning={true}
          >
            <button
              className={`
                transition-colors duration-200
                ${content.values.borderRadius}
              `}
              style={{
                backgroundColor: content.values.buttonColors?.backgroundColor,
                color: content.values.buttonColors?.color,
                borderWidth: content.values.border?.borderWidth || "0px",
                borderStyle: content.values.border?.borderStyle || "none",
                borderColor: content.values.border?.borderColor || "#CCCCCC",
                padding: content.values.padding,
                borderRadius: content.values.borderRadius,
                width: content.values.size?.autoWidth
                  ? "auto"
                  : content.values.size?.width,
                lineHeight: content.values.lineHeight,
                letterSpacing: content.values.letterSpacing,
              }}
              dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
            />
          </div>
        ) : (
          <div
            style={{
              padding: content.values.containerPadding,
              textAlign: content.values.textAlign as TextAlign,
            }}
          >
            <button
              className={`
              transition-colors duration-200
            `}
              style={{
                backgroundColor: content.values.buttonColors?.backgroundColor,
                color: content.values.buttonColors?.color,
                borderWidth: content.values.border?.borderWidth || "0px",
                borderStyle: content.values.border?.borderStyle || "none",
                borderColor: content.values.border?.borderColor || "#CCCCCC",
                padding: content.values.padding,
                borderRadius: content.values.borderRadius,
                width: content.values.size?.autoWidth
                  ? "auto"
                  : content.values.size?.width,
                lineHeight: content.values.lineHeight,
                letterSpacing: content.values.letterSpacing,
              }}
              dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
            />
          </div>
        );

      case "image":
        return !isPreviewMode ? (
          <div
            style={{
              padding: content.values.containerPadding,
              textAlign: content.values.textAlign as TextAlign,
            }}
            contentEditable={selectedElement?.id === content.id}
            onInput={handleTextChange}
            onMouseUp={handleMouseUp}
            suppressContentEditableWarning={true}
          >
            <img
              src={
                content.values.src?.url ||
                "https://cdn.tools.unlayer.com/image/placeholder.png"
              }
              alt={content.values.altText || ""}
              style={{
                width: content.values.src?.autoWidth
                  ? "100%"
                  : content.values.src?.maxWidth,
                maxWidth: content.values.src?.autoWidth
                  ? content.values.src?.width
                  : content.values.src?.maxWidth,
              }}
              onClick={() => {
                if (content.values.href?.values.href) {
                  window.open(content.values.href.values.href, "_blank");
                }
              }}
            />
          </div>
        ) : (
          <div
            style={{
              padding: content.values.containerPadding,
              textAlign: content.values.textAlign as TextAlign,
            }}
          >
            <img
              src={
                content.values.src?.url ||
                "https://cdn.tools.unlayer.com/image/placeholder.png"
              }
              alt={content.values.altText || ""}
              style={{
                width: content.values.src?.autoWidth
                  ? "100%"
                  : content.values.src?.maxWidth,
                maxWidth: content.values.src?.autoWidth
                  ? content.values.src?.width
                  : content.values.src?.maxWidth,
              }}
            />
          </div>
        );
      case "heading":
        switch (content.values.headingType) {
          case "h1":
            return !isPreviewMode ? (
              <h1
                contentEditable={selectedElement?.id === content.id}
                onInput={handleTextChange}
                onMouseUp={handleMouseUp}
                suppressContentEditableWarning={true}
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                  fontFamily: content.values.fontFamily?.value,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            ) : (
              <h1
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            );
          case "h2":
            return !isPreviewMode ? (
              <h2
                contentEditable={selectedElement?.id === content.id}
                onInput={handleTextChange}
                onMouseUp={handleMouseUp}
                suppressContentEditableWarning={true}
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                  fontFamily: content.values.fontFamily?.value,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            ) : (
              <h2
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            );

          case "h3":
            return !isPreviewMode ? (
              <h3
                contentEditable={selectedElement?.id === content.id}
                onInput={handleTextChange}
                onMouseUp={handleMouseUp}
                suppressContentEditableWarning={true}
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            ) : (
              <h3
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            );
          case "h4":
            return !isPreviewMode ? (
              <h4
                contentEditable={selectedElement?.id === content.id}
                onInput={handleTextChange}
                onMouseUp={handleMouseUp}
                suppressContentEditableWarning={true}
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            ) : (
              <h4
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            );
            return (
              <h6
                style={{
                  fontSize: content.values.fontSize,
                  fontWeight: content.values.fontWeight,
                  lineHeight: content.values.lineHeight,
                  letterSpacing: content.values.letterSpacing,
                  textAlign: content.values.textAlign as TextAlign,
                  color: content.values.color,
                  padding: content.values.containerPadding,
                }}
                dangerouslySetInnerHTML={{ __html: content.values.text || "" }}
              />
            );
          default:
            return null;
        }
      case "divider":
        return (
          <div
            className="flex"
            style={{
              padding: content.values.containerPadding,
              justifyContent: content.values.textAlign as TextAlign,
            }}
          >
            <hr
              style={{
                borderColor: content.values.border?.borderTopColor,
                borderWidth: content.values.border?.borderTopWidth,
                borderStyle: content.values.border?.borderTopStyle,
                width: content.values.width,
              }}
            />
          </div>
        );
      case "menu":
        return !isPreviewMode ? (
          <menu
            className="flex justify-center"
            style={{
              padding: content.values.containerPadding,
              justifyContent:
                content.values.align == "center"
                  ? "center"
                  : content.values.align == "right"
                    ? "flex-end"
                    : "flex-start",
              alignItems:
                content.values.align == "center"
                  ? "center"
                  : content.values.align == "right"
                    ? "flex-end"
                    : "flex-start",
              flexDirection:
                content.values.layout == "horizontal" ? "row" : "column",
              fontFamily: content.values.fontFamily?.value,
              fontWeight: content.values.fontWeight,
              fontSize: content.values.fontSize,
              letterSpacing: content.values.letterSpacing,
            }}
          >
            {content.values.menu?.items.length === 0 ? (
              <div className="bg-white w-full h-24 text-gray-400 flex items-center justify-center gap-2 flex-col">
                <div className="w-6 h-6">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="bars"
                    className="svg-inline--fa fa-bars fa-2x "
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M0 88C0 74.7 10.7 64 24 64l400 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 112C10.7 112 0 101.3 0 88zM0 248c0-13.3 10.7-24 24-24l400 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 272c-13.3 0-24-10.7-24-24zM448 408c0 13.3-10.7 24-24 24L24 432c-13.3 0-24-10.7-24-24s10.7-24 24-24l400 0c13.3 0 24 10.7 24 24z"
                    ></path>
                  </svg>
                </div>
                <div>Menu</div>
              </div>
            ) : (
              content.values.menu?.items.map((item, index) => (
                <div key={item.key} className="flex">
                  <a
                    style={{
                      color: content.values.linkColor,
                      padding: content.values.padding,
                    }}
                  >
                    {item.text}
                  </a>{" "}
                  {content.values.layout === "horizontal" &&
                    index < content.values.menu?.items.length! - 1 && (
                      <span
                        style={{
                          color: content.values.textColor,
                          padding: content.values.padding,
                        }}
                      >
                        {content.values.separator}
                      </span>
                    )}
                </div>
              ))
            )}
          </menu>
        ) : (
          <menu
            className="flex justify-center"
            style={{
              padding: content.values.containerPadding,
              justifyContent:
                content.values.align == "center"
                  ? "center"
                  : content.values.align == "right"
                    ? "flex-end"
                    : "flex-start",
              alignItems:
                content.values.align == "center"
                  ? "center"
                  : content.values.align == "right"
                    ? "flex-end"
                    : "flex-start",
              flexDirection:
                content.values.layout == "horizontal" ? "row" : "column",
              fontFamily: content.values.fontFamily?.value,
              fontWeight: content.values.fontWeight,
              fontSize: content.values.fontSize,
              letterSpacing: content.values.letterSpacing,
            }}
          >
            {content.values.menu?.items.map((item, index) => (
              <div key={item.key} className="flex">
                <a
                  style={{
                    color: content.values.linkColor,
                    padding: content.values.padding,
                  }}
                >
                  {item.text}
                </a>{" "}
                {content.values.layout === "horizontal" &&
                  index < content.values.menu?.items.length! - 1 && (
                    <span
                      style={{
                        color: content.values.textColor,
                        padding: content.values.padding,
                      }}
                    >
                      {content.values.separator}
                    </span>
                  )}
              </div>
            ))}
          </menu>
        );

      case "social":
        return (
          <div
            className="flex justify-center items-center"
            style={{
              padding: content.values.containerPadding,
            }}
          >
            <img
              src="https://cdn.tools.unlayer.com/social/icons/default.png"
              className="h-8"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return !isPreviewMode ? (
    <>
      <div
        ref={combineRefs}
        className={`
          relative group
          ${content.values.selectable ? "cursor-pointer" : ""}
          ${content.values.draggable ? "cursor-move" : ""}
          ${isOver
            ? isBeforeRef.current
              ? "border-t-4 border-t-blue-400"
              : "border-b-4 border-b-blue-400"
            : ""
          }
          ${selectedElement?.id === content.id
            ? "outline outline-[#4DADFD]"
            : ""
          }
          hover:outline hover:outline-[#5DBDFD] hover:bg-[#0871C244]
        `}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ id: content.id, type: content.type });
        }}
      >
        {isOver && (
          <div
            className="absolute bg-blue-500 rounded-2xl text-white px-3 py-1 text-xs z-50"
            style={{
              top: isBeforeRef.current ? -13 : "auto",
              bottom: isBeforeRef.current ? "auto" : -13,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Drag it Here
          </div>
        )}
        {renderContent()}

        {/* Content Actions Overlay */}
        {selectedElement?.id === content.id && (
          <>
            <div className="absolute flex items-center justify-center bg-black/10 bottom-0 translate-y-full z-10">
              <div className="flex gap-2">
                {content.values.duplicatable && (
                  <button
                    className="p-1 bg-white rounded shadow hover:bg-gray-300"
                    onClick={handleDuplicate}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                {content.values.deletable && (
                  <button
                    className="p-1 bg-white rounded shadow hover:bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute right-0 top-[50%] translate-y-[-50%] translate-x-[50%]">
              <button
                ref={drag as any}
                className="rounded-full bg-blue-600 border-none p-2 text-white hover:bg-blue-700 hover:cursor-move"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="w-4 h-4 text-white"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M273 7c-9.4-9.4-24.6-9.4-33.9 0L167 79c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31L232 232 81.9 232l31-31c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 239c-9.4 9.4-9.4 24.6 0 33.9l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-31-31L232 280l0 150.1-31-31c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c9.4 9.4 24.6 9.4 33.9 0l72-72c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-31 31L280 280l150.1 0-31 31c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l72-72c9.4-9.4 9.4-24.6 0-33.9l-72-72c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l31 31L280 232l0-150.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L273 7z"
                  ></path>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t("builder.deleteConfirm.title")}
        message={t("builder.deleteConfirm.message")}
      />
    </>
  ) : (
    <div>{renderContent()}</div>
  );
};

export default ContentRenderer;
