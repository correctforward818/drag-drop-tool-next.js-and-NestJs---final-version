import React from "react";
import { useDrop } from "react-dnd";
import type { Column as ColumnType, ElementType } from "../types/template";
import ContentRenderer from "./ContentRenderer";
import { useBuilder } from "../hooks/useBuilder";
import { v4 as uuidv4 } from "uuid";

interface ColumnProps {
  column: ColumnType;
  width: string;
  isPreviewMode: boolean;
}

const Column: React.FC<ColumnProps> = ({ column, width, isPreviewMode }) => {
  const { isDragging, dragElementType, addContent, deleteContent } =
    useBuilder();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["text", "button", "image", "divider", "menu", "social", "heading"],
    canDrop: (item, monitor) => {
      return monitor.isOver({ shallow: true });
    },
    drop: (item: { type: ElementType; content: any; columnId?: string }) => {
      console.log(item.content);
      if (item.content.id) {
        console.log("deleting");
        deleteContent(item.content.id);
      }
      addContent(
        column.id,
        {
          ...item.content,
          id: item.content.id ? item.content.id : uuidv4(),
        },
        -1
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Helper function to get border style
  const getBorderStyle = (side: "Top" | "Right" | "Bottom" | "Left") => {
    const border = column.values.border;
    if (isDragging && dragElementType !== "column") {
      return "1px dashed white";
    }

    const width = border?.[`border${side}Width`];
    const style = border?.[`border${side}Style`];
    const color = border?.[`border${side}Color`];

    return width
      ? `${width} ${style || "solid"} ${color || "#000"}`
      : column.contents.length === 0
        ? "1px dashed rgb(96 165 250)"
        : "none";
  };

  // Compute styles object once
  const columnStyles = () => ({
    width,
    backgroundColor: column.values.backgroundColor
      ? column.values.backgroundColor
      : column.contents.length === 0
        ? "rgba(239, 246, 255, 0.3)"
        : "transparent",
    borderRadius: column.values.borderRadius || "0px",
    borderTop: getBorderStyle("Top"),
    borderRight: getBorderStyle("Right"),
    borderBottom: getBorderStyle("Bottom"),
    borderLeft: getBorderStyle("Left"),
    padding: column.values.padding,
  });

  return !isPreviewMode ? (
    <div
      ref={drop as any}
      style={columnStyles()}
      className={`
        transition-all duration-200
        relative
      `}
    >
      {column.contents.length === 0 ? (
        <>
          <div
            className={`flex flex-col items-center justify-center h-full min-h-[100px] text-gray-500 p-5 ${isOver ? "border-t-4 border-t-blue-400" : ""
              }`}
          >
            <p className="mb-2">Drop content here</p>
          </div>
          {isOver && (
            <div
              className="absolute bg-blue-500 rounded-2xl text-white px-3 py-1 text-xs z-50"
              style={{
                top: -13,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              Drag it Here
            </div>
          )}
        </>
      ) : (
        column.contents.map((content, index) => (
          <ContentRenderer
            key={content.id}
            content={content}
            index={index}
            columnId={column.id}
            isPreviewMode={false}
          />
        ))
      )}
    </div>
  ) : (
    <div style={columnStyles()}>
      {column.contents.map((content, index) => (
        <ContentRenderer
          key={content.id}
          content={content}
          index={index}
          columnId={column.id}
          isPreviewMode={true}
        />
      ))}
    </div>
  );
};

export default Column;
