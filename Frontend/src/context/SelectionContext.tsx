import React, { createContext, useContext, useState, useMemo } from "react";

interface SelectionState {
  selectedIds: Set<number | string>;
  selectedData: any[];
}

const SelectionStateContext = createContext<SelectionState | undefined>(
  undefined
);

interface SelectionActions {
  setSelection: (ids: Set<number | string>, data: any[]) => void;
  clearSelection: () => void;
}

const SelectionActionsContext = createContext<SelectionActions | undefined>(
  undefined
);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(
    new Set()
  );
  const [selectedData, setSelectedData] = useState<any[]>([]);

  const actions = useMemo<SelectionActions>(
    () => ({
      setSelection: (ids: Set<number | string>, data: any[]) => {
        setSelectedIds(ids);
        setSelectedData(data);
      },
      clearSelection: () => {
        setSelectedIds(new Set());
        setSelectedData([]);
      },
    }),
    []
  );

  const state = useMemo<SelectionState>(
    () => ({
      selectedIds,
      selectedData,
    }),
    [selectedIds, selectedData]
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
