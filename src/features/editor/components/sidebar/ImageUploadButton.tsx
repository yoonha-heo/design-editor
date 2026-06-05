import { useRef } from "react";
import { Image } from "lucide-react";

import { useEditorStore } from "../../store/editorStore";
import {
  DEFAULT_ELEMENT_X,
  DEFAULT_ELEMENT_Y,
} from "../../constants/editorDefaults";

export function ImageUploadButton() {
  const addImageAt = useEditorStore((state) => state.addImageAt);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const src = URL.createObjectURL(file);

    addImageAt(src, DEFAULT_ELEMENT_X, DEFAULT_ELEMENT_Y);

    event.target.value = "";
  };

  return (
    <>
      <button
        onClick={handleOpenFilePicker}
        className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        <Image size={20} />
        <span>Image</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </>
  );
}
