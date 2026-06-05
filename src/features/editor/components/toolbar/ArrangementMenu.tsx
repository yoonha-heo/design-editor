import { BringToFront, MoveDown, MoveUp, SendToBack } from "lucide-react";

import { useEditorStore } from "../../store/editorStore";
import { useUIStore } from "../../store/UIStore";
import { ToolbarButton } from "./ToolbarButton";

function ArrangementMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 text-md text-gray-700 hover:text-black"
    >
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}

export function ArrangementMenu() {
  const { isArrangementMenuOpen, toggleArrangementMenu } = useUIStore();

  const {
    selectedElementId,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useEditorStore();

  const isDisabled = !selectedElementId;

  const handleToggleArrangementMenu = () => {
    if (isDisabled) return;

    toggleArrangementMenu();
  };

  const handleArrangementAction = (action: (id: string) => void) => {
    if (isDisabled) return;

    action(selectedElementId);
  };

  return (
    <>
      <ToolbarButton
        icon={<BringToFront size={20} />}
        tooltip="Arrangement"
        onClick={handleToggleArrangementMenu}
      />

      {isArrangementMenuOpen && (
        <div className="absolute right-0 top-12 z-50 w-[300px] rounded-lg bg-white p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            <ArrangementMenuItem
              icon={<MoveUp size={18} />}
              label="Forward"
              onClick={() => handleArrangementAction(bringForward)}
            />

            <ArrangementMenuItem
              icon={<MoveDown size={18} />}
              label="Backward"
              onClick={() => handleArrangementAction(sendBackward)}
            />

            <ArrangementMenuItem
              icon={<BringToFront size={18} />}
              label="To front"
              onClick={() => handleArrangementAction(bringToFront)}
            />

            <ArrangementMenuItem
              icon={<SendToBack size={18} />}
              label="To back"
              onClick={() => handleArrangementAction(sendToBack)}
            />
          </div>
        </div>
      )}
    </>
  );
}
