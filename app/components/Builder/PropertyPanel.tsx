import { useTranslation } from 'react-i18next';
import ColumnPropertyPanel from '../Properties/ColumnPropertyPanel';
import { useBuilder } from '../../hooks/useBuilder';
import TextPropertyPanel from '../Properties/TextPropertyPanel';
import ButtonPropertyPanel from '../Properties/ButtonPropertyPanel';
import ImagePropertyPanel from '../Properties/ImagePropertyPanel';
import HeadingPropertyPanel from '../Properties/HeadingPropertyPanel';
import ComponentPanel from './ComponentPanel';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DividerPropertyPanel from '../Properties/DividerPropertyPanel';
import MenuPropertyPanel from '../Properties/MenuPropertyPanel';

const PropertyPanel = ({
}) => {
  const { t } = useTranslation();
  const {selectedElement, setSelectedElement} = useBuilder();

  if (!selectedElement) {
    return (
      <ComponentPanel />
    );
  }

  const renderPropertyPanel = () => {
    switch (selectedElement.type) {
      case 'column':
        return (
          <ColumnPropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'text':
        return (
          <TextPropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'button':
        return (
          <ButtonPropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'image':
        return (
          <ImagePropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'heading':
        return (
          <HeadingPropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'divider':
        return (
          <DividerPropertyPanel
            selectedElement={selectedElement}
          />
        );
      case 'menu':
        return (
          <MenuPropertyPanel
            selectedElement={selectedElement}
          />
        );
      default:
        return (
          <p className="text-gray-500 text-sm">
            {t('builder.properties.unsupportedType')}
          </p>
        );
    }
  };

  return (
    <div className="w-96 bg-white p-4 border-l overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">
          {`${t(`builder.components.${selectedElement.type}.label`)} ${t('builder.properties.title')}`}
        </h2>
        <button
          onClick={() => setSelectedElement(null)}
          className={`
            p-2 rounded-full
            text-gray-400 hover:text-gray-600
            bg-gray-50 hover:bg-gray-100
            border border-transparent hover:border-gray-200
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-100
          `}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      {renderPropertyPanel()}
    </div>
  );
};

export default PropertyPanel; 