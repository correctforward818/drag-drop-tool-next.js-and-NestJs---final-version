import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { useComponentRegistry } from "../../registry/componentRegistry";
import { useTranslation } from "react-i18next";
import type { ElementType } from "../../types/template";
import { useBuilder } from "~/hooks/useBuilder";

const ComponentPanel: React.FC = () => {
  const { t } = useTranslation();
  const componentRegistry = useComponentRegistry();

  return (
    <div className="w-96 bg-white p-4 border-r">
      <h2 className="text-lg font-medium mb-4">
        {t("builder.components.title")}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(componentRegistry).map(([type, config]) => (
          <DraggableComponent
            key={type}
            type={type as ElementType}
            icon={config.icon}
            content={config.content}
            label={t(`builder.components.${type}.label`)}
          />
        ))}
      </div>
    </div>
  );
};

interface DraggableComponentProps {
  type: ElementType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  content: any;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  icon: Icon,
  label,
  content,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type, content },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const { setIsDragging, setDragElementType } = useBuilder();

  useEffect(() => {
    setIsDragging(isDragging);
    setDragElementType(isDragging ? type : null);
  }, [isDragging]);

  return (
    <div
      ref={drag as any}
      className={`
        flex flex-col items-center justify-center
        p-3 rounded-lg cursor-move
        bg-gradient-to-br from-white to-gray-50
        border-2 border-dashed border-gray-200
        transition-all duration-300 ease-in-out
        hover:border-blue-300 hover:from-blue-50/30 hover:to-white
        hover:shadow-md hover:scale-105
        active:scale-95
        ${
          isDragging
            ? "opacity-50 border-blue-400 shadow-lg scale-105 bg-blue-50/50"
            : "hover:border-blue-200"
        }
      `}
    >
      <Icon
        className={`
        w-8 h-8 mb-2
        transition-colors duration-300
        ${
          isDragging
            ? "text-blue-500"
            : "text-gray-600 group-hover:text-blue-500"
        }
      `}
      />
      <span
        className={`
        text-xs font-medium text-center
        transition-colors duration-300
        ${isDragging ? "text-blue-500" : "text-gray-600"}
      `}
      >
        {label}
      </span>
    </div>
  );
};

export default ComponentPanel;
