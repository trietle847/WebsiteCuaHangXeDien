import React, { createContext, useContext, useState, useMemo } from "react";

interface SelectionState {
  selectedData: any[];
}

const SelectionStateContext = createContext<SelectionState | undefined>(
  undefined
);

interface SelectionActions {
  setSelection: (data: any[]) => void;
  clearSelection: () => void;
}

const SelectionActionsContext = createContext<SelectionActions | undefined>(
  undefined
);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedData, setSelectedData] = useState<any[]>([]);

  const actions = useMemo<SelectionActions>(
    () => ({
      setSelection: ( data: any[]) => {
        setSelectedData(data);
      },
      clearSelection: () => {
        setSelectedData([]);
      },
    }),
    []
  );

  const state = useMemo<SelectionState>(
    () => ({
      selectedData,
    }),
    [selectedData]
  );

  return (
    <SelectionActionsContext.Provider value={actions}>
      <SelectionStateContext.Provider value={state}>
        {children}
      </SelectionStateContext.Provider>
    </SelectionActionsContext.Provider>
  );
}

export function useSelectionState() {
  const context = useContext(SelectionStateContext);
  if (!context) {
    throw new Error("useSelectionState must be used within SelectionProvider");
  }
  return context;
}

export function useSelectionActions() {
  const context = useContext(SelectionActionsContext);
  if (!context) {
    throw new Error(
      "useSelectionActions must be used within SelectionProvider"
    );
  }
  return context;
}
