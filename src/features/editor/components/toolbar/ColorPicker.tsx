import { Palette } from "lucide-react";
import { HexColorPicker } from "react-colorful";

import { useEditorStore } from "../../store/editorStore";
import { useUIStore } from "../../store/UIStore";
import { ToolbarButton } from "./ToolbarButton";

export function ColorPicker() {
  const { isColorPickerOpen, toggleColorPicker } = useUIStore();

  const { elements, selectedElementId, updateFill } = useEditorStore();

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  const canChangeFill = selectedElement && selectedElement.type !== "image";

  return (
    <>
      <ToolbarButton
        icon={<Palette size={20} />}
        tooltip="Color"
        onClick={toggleColorPicker}
      />

      {isColorPickerOpen && canChangeFill && (
        <div className="absolute top-12 right-0 z-50 rounded-lg bg-white">
          <HexColorPicker
            color={selectedElement.fill}
            onChange={(color) => updateFill(selectedElement.id, color)}
          />
        </div>
      )}
    </>
  );
}
