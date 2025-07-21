import React from "react";
import { useDrop } from "react-dnd";
import RowComponent from "../Row";
import { useBuilder } from "../../hooks/useBuilder";
import { useTranslation } from "react-i18next";

const Canvas: React.FC<{ isPreviewMode: boolean }> = ({ isPreviewMode }) => {
  const { t } = useTranslation();
  const { template, insertRow } = useBuilder();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "column",
    canDrop: (_, monitor) => {
      return monitor.isOver({ shallow: true });
    },
    drop: (item: { type: string }) => {
      if (item.type === "column") {
        insertRow(-1);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return !isPreviewMode ? (
    <div
      ref={drop as any}
      className={`shadow-sm
        ${isOver ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
      style={{
        backgroundColor: template.body.values.backgroundColor,
      }}
    >
      {template.body.rows.map((row, index) => (
        <RowComponent key={row.id} row={row} index={index} isPreviewMode={false} />
      ))}
      {template.body.rows.length === 0 && (
        <div className="flex items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">{t("builder.canvas.dropContentHere")}</p>
        </div>
      )}
    </div>
  ) : (
    <div
      className="shadow-sm"
      style={{
        backgroundColor: template.body.values.backgroundColor,
      }}
    >
      {template.body.rows.map((row, index) => (
        <RowComponent key={row.id} row={row} index={index} isPreviewMode={true} />
      ))}
    </div>
  );
};

export default Canvas;
