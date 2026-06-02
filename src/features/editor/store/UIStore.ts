import { create } from "zustand";

type UIStore = {
  isArrangementMenuOpen: boolean;
  isColorPickerOpen: boolean;

  toggleArrangementMenu: () => void;
  toggleColorPicker: () => void;
  closeFloatingMenus: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isArrangementMenuOpen: false,
  isColorPickerOpen: false,

  toggleArrangementMenu: () =>
    set((state) => ({
      isArrangementMenuOpen: !state.isArrangementMenuOpen,
      isColorPickerOpen: false,
    })),

  toggleColorPicker: () =>
    set((state) => ({
      isColorPickerOpen: !state.isColorPickerOpen,
      isArrangementMenuOpen: false,
    })),

  closeFloatingMenus: () =>
    set({
      isArrangementMenuOpen: false,
      isColorPickerOpen: false,
    }),
}));
