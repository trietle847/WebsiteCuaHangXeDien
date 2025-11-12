import {
  createContext,
  useContext,
  useState,
  useMemo,
  type JSX,
  type ReactNode,
} from "react";

// ========================================
// TYPES
// ========================================
type OpenDialogOptions = {
  title: string;
  content: JSX.Element;
  onConfirm?: (data?: any) => void;
};

type DialogState = {
  open: boolean;
  title: string;
  content: JSX.Element | null;
  onConfirm?: (data?: any) => void;
};

type DialogActions = {
  openDialog: (options: OpenDialogOptions) => void;
  closeDialog: () => void;
};

// ========================================
// 2 CONTEXT RIÊNG BIỆT - Tách state và actions
// ========================================
const DialogStateContext = createContext<DialogState | undefined>(undefined);
const DialogActionsContext = createContext<DialogActions | undefined>(
  undefined
);

// ========================================
// PROVIDER
// ========================================
export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [onConfirm, setOnConfirm] = useState<
    ((data?: any) => void) | undefined
  >();

  // ✅ Actions được memoize - KHÔNG BAO GIỜ thay đổi reference
  const actions = useMemo<DialogActions>(
    () => ({
      openDialog: ({ title, content, onConfirm }: OpenDialogOptions) => {
        setTitle(title);
        setContent(content);
        setOnConfirm(() => onConfirm);
        setOpen(true);
      },
      closeDialog: () => {
        setOpen(false);
        setTimeout(() => {
          setTitle("");
          setContent(null);
          setOnConfirm(undefined);
        }, 300);
      },
    }),
    [] // ← Empty deps - actions STABLE
  );

  // ✅ State - Chỉ GlobalDialog subscribe
  const state = useMemo<DialogState>(
    () => ({ open, title, content, onConfirm }),
    [open, title, content, onConfirm]
  );

  return (
    <DialogActionsContext.Provider value={actions}>
      <DialogStateContext.Provider value={state}>
        {children}
      </DialogStateContext.Provider>
    </DialogActionsContext.Provider>
  );
};

// ========================================
// HOOKS
// ========================================

/**
 * ✅ Hook cho components chỉ cần ACTIONS (EntityDataGrid, configs)
 * KHÔNG re-render khi dialog state thay đổi
 */
export const useDialogActions = () => {
  const context = useContext(DialogActionsContext);

  if (context === undefined) {
    throw new Error("useDialogActions must be used within DialogProvider");
  }

  return context;
};

/**
 * ✅ Hook cho components cần STATE (GlobalDialog)
 * Re-render khi dialog state thay đổi
 */
export const useDialogState = () => {
  const context = useContext(DialogStateContext);

  if (context === undefined) {
    throw new Error("useDialogState must be used within DialogProvider");
  }

  return context;
};

/**
 * ✅ Hook cho components cần CẢ HAI (rare cases)
 */
export const useDialog = () => {
  return {
    ...useDialogState(),
    ...useDialogActions(),
  };
};
