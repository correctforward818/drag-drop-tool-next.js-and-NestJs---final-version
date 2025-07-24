import React, { useRef } from "react";
import LabelInput from "./LabelInput";
import { ChevronDownIcon, PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface ImageSectionProps {
    label?: string;
    image?: File | null;
    imageUrl?: string;
    onImageChange: (file: File) => void;
    onUrlChange: (url: string) => void;
    onEdit?: () => void;
    dropdownOptions?: string[];
    onDropdownSelect?: (option: string) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
    label = "Image",
    image,
    imageUrl,
    onImageChange,
    onUrlChange,
    onEdit,
    dropdownOptions = [],
    onDropdownSelect,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Top line: label, button, dropdown */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Upload
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {dropdownOptions.length > 0 && (
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center px-2 py-1 border rounded text-xs"
                            >
                                Options
                                <ChevronDownIcon className="w-4 h-4 ml-1" />
                            </button>
                            {/* You can implement dropdown logic here */}
                        </div>
                    )}
                </div>
            </div>

            {/* Second line: image area */}
            <div className="w-full border rounded bg-gray-100 min-h-[120px] flex items-center justify-center p-2">
                {!image ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-center text-gray-400">
                        <PhotoIcon className="w-10 h-10 mb-2" />
                        <span className="text-xs">
                            Drag a new image here, or click to select files to upload.
                        </span>
                    </div>
                ) : (
                    <div className="flex w-full gap-4">
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded"
                                className="max-h-24 max-w-full rounded"
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-start gap-2">
                            <span className="text-xs text-gray-700 break-all">{image.name}</span>
                            <button
                                type="button"
                                className="flex items-center gap-1 px-2 py-1 rounded border text-xs hover:bg-gray-100"
                                onClick={onEdit}
                            >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Third line: LabelInput for URL */}
            <LabelInput
                label="Image URL"
                value={imageUrl}
                onChange={onUrlChange}
                placeholder="https://"
            />
        </div>
    );
};

export default ImageSection;