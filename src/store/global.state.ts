import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

type SheetContext = "cart" | "search" | null;
export interface GlobalState {
    isSheetOpen: boolean;
    sheetContext: SheetContext;
    activeNavMobile: boolean;

    openSheet: (context: SheetContext) => void;
    closeSheet: () => void;
    setActiveNavMobile: (active: boolean) => void;
}

 const initialGlobalState: StateCreator<GlobalState> = set => ({
    isSheetOpen: false,
    sheetContext: null,
    activeNavMobile: false,

    openSheet: context => set(() => ({
        isSheetOpen: true,
        sheetContext: context
    })),
    closeSheet: () => set(() => ({
        isSheetOpen: false,
        sheetContext: null
    })),

    setActiveNavMobile: (active: boolean) => {
        set({ activeNavMobile: active });
    }
})

export const useGlobalStore = create<GlobalState>()(
    devtools(initialGlobalState)
)