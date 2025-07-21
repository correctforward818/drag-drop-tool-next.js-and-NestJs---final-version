import React, { useState } from "react";
import { Provider } from "react-redux";
import { EyeIcon, ArrowDownTrayIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import Canvas from "./Canvas";
import PropertyPanel from "./PropertyPanel";
import { store } from "../../store";
import { useTranslation } from "react-i18next";
import { useBuilder } from "~/hooks/useBuilder";
import toast from 'react-hot-toast';

const BuilderContent: React.FC = () => {
  const { t } = useTranslation();
  const { template } = useBuilder();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    toast.success(isPreviewMode 
      ? t('builder.toast.editMode') 
      : t('builder.toast.previewMode')
    );
  };

  const handleSaveDesign = () => {
    console.log('Template JSON:', template);
    toast.success(t('builder.toast.designSaved'));
  };

  const handleExportHTML = () => {
    console.log('Generated HTML:', template);
    toast.success(t('builder.toast.htmlExported'));
  };

  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      <header className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {t('builder.header.title')}
          </h1>
        </div>

        <div className="flex items-center gap-3 py-2">
          <button
            onClick={handlePreview}
            className={`
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isPreviewMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <EyeIcon className="w-4 h-4" />
            {isPreviewMode ? t('builder.header.editDesign') : t('builder.header.preview')}
          </button>

          <button
            onClick={handleSaveDesign}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {t('builder.header.saveDesign')}
          </button>

          <button
            onClick={handleExportHTML}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CodeBracketIcon className="w-4 h-4" />
            {t('builder.header.exportHTML')}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {isPreviewMode ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-[1500px] mx-auto bg-white shadow-lg rounded-lg p-4">
              <Canvas isPreviewMode={true} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              <Canvas isPreviewMode={false} />
            </div>
            <PropertyPanel />
          </>
        )}
      </div>
    </div>
  );
};

// Wrap the builder with Redux Provider
const Builder: React.FC = () => {
  return (
    <Provider store={store}>
      <BuilderContent />
    </Provider>
  );
};

export default Builder;
