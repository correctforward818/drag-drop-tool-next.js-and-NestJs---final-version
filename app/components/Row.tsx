import type { Row, Row as RowType } from "../types/template";
import Column from "./Column";
import { useAppSelector, useBuilder } from "../hooks/useBuilder";
import { useDrop, type DropTargetMonitor } from "react-dnd";
import { useRef, useEffect } from "react";

interface RowProps {
  row: RowType;
  index: number;
  isPreviewMode: boolean;
}

export default function Row({ row, index, isPreviewMode }: RowProps) {
  const { setSelectedElement, insertRow, selectedElement } = useBuilder();
  const { isDragging, dragElementType } = useAppSelector(
    (state) => state.builder
  );

  const currentIndex = useRef(index);
  const rowRef = useRef<HTMLDivElement>(null);
  const isBeforeRef = useRef(false);

  useEffect(() => {
    currentIndex.current = index;
  }, [index]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["column"],
      canDrop: (item, monitor) => {
        return monitor.isOver({ shallow: true });
      },
      hover: (item: { type: string }, monitor: DropTargetMonitor) => {
        if (item.type === "column") {
          const clientOffset = monitor.getClientOffset();
          const hoverBoundingRect = rowRef.current?.getBoundingClientRect();

          if (!clientOffset || !hoverBoundingRect) return;

          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const isBefore =
            clientOffset.y < hoverBoundingRect.top + hoverMiddleY;

          isBeforeRef.current = isBefore;
        }
      },
      drop: (item: { type: string }, monitor: DropTargetMonitor) => {
        if (item.type === "column") {
          const clientOffset = monitor.getClientOffset();
          const hoverBoundingRect = rowRef.current?.getBoundingClientRect();

          if (!clientOffset || !hoverBoundingRect) return;

          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const isBefore =
            clientOffset.y < hoverBoundingRect.top + hoverMiddleY;

          insertRow(isBefore ? currentIndex.current : currentIndex.current + 1);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  // Combine refs
  const combineRefs = (el: HTMLDivElement) => {
    rowRef.current = el;
    drop(el);
  };

  const calculateWidth = (cellValue: number, totalCells: number) => {
    return `${(cellValue / totalCells) * 100}%`;
  };

  const totalCells = row.cells.reduce((acc, cell) => acc + cell, 0);

  return !isPreviewMode ? (
    <div
      ref={combineRefs}
      className={`
        flex w-full
        justify-center
        items-center
        ${selectedElement?.id === row.id ? "border-2 border-blue-400" : ""}
        ${
          isDragging && dragElementType === "column"
            ? "border border-dashed border-white"
            : ""
        }
        [&:not(:has(*:hover))]:hover:border-blue-400 [&:not(:has(*:hover))]:hover:border-2 [&:not(:has(*:hover))]:hover:bg-blue-100
        ${
          isOver
            ? isBeforeRef.current
              ? "border-t-4 border-t-blue-400"
              : "border-b-4 border-b-blue-400"
            : ""
        }
        relative
      `}
      style={{
        backgroundColor: row.values.backgroundColor
          ? row.values.backgroundColor
          : "transparent",
        backgroundImage: row.values.backgroundImage
          ? `url(${row.values.backgroundImage.url})`
          : "",
        backgroundRepeat: row.values.backgroundImage
          ? row.values.backgroundImage.repeat
          : "",
        backgroundSize: row.values.backgroundImage
          ? row.values.backgroundImage.size
          : "",
        backgroundPosition: row.values.backgroundImage
          ? row.values.backgroundImage.position
          : "",
        padding: row.values.padding ? row.values.padding : "0px",
      }}
      onClick={() => setSelectedElement({ id: row.id, type: "column" })}
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
      <div
        className="flex max-w-[700px] w-full"
        style={{
          backgroundColor: row.values.columnsBackgroundColor
            ? row.values.columnsBackgroundColor
            : "transparent",
        }}
      >
        {row.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            width={calculateWidth(row.cells[index], totalCells)}
            isPreviewMode={false}
          />
        ))}
      </div>
    </div>
  ) : (
    <div
      className={`
        flex w-full
        justify-center
        items-center
      `}
      style={{
        backgroundColor: row.values.backgroundColor
          ? row.values.backgroundColor
          : "transparent",
        backgroundImage: row.values.backgroundImage
          ? `url(${row.values.backgroundImage.url})`
          : "",
        backgroundRepeat: row.values.backgroundImage
          ? row.values.backgroundImage.repeat
          : "",
        backgroundSize: row.values.backgroundImage
          ? row.values.backgroundImage.size
          : "",
        backgroundPosition: row.values.backgroundImage
          ? row.values.backgroundImage.position
          : "",
        padding: row.values.padding ? row.values.padding : "0px",
      }}
    >
      <div
        className="flex max-w-[700px] w-full"
        style={{
          backgroundColor: row.values.columnsBackgroundColor
            ? row.values.columnsBackgroundColor
            : "transparent",
        }}
      >
        {row.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            width={calculateWidth(row.cells[index], totalCells)}
            isPreviewMode={true}
          />
        ))}
      </div>
    </div>
  );
}
