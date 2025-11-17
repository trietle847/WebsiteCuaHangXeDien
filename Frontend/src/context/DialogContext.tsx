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
  title?: string;
  content: JSX.Element;
  dialogSize?: "sm" | "md" | "lg" | "xl";
  onConfirm?: (data?: any) => void;
  customTitle?: JSX.Element;
  customActions?: JSX.Element;
  ActionOnClose?: () => void;
};

type DialogState = {
  open: boolean;
  title?: string;
  content: JSX.Element | null;
  dialogSize?: "sm" | "md" | "lg" | "xl";
  onConfirm?: (data?: any) => void;
  customTitle?: JSX.Element;
  customActions?: JSX.Element;
  ActionOnClose?: () => void;
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
  const [dialogSize, setDialogSize] = useState<"sm" | "md" | "lg" | "xl" | undefined>(
    undefined
  );
  const [customTitle, setCustomTitle] = useState<JSX.Element | undefined>(
    undefined
  );
  const [customActions, setCustomActions] = useState<JSX.Element | undefined>(
    undefined
  );
  const [ActionOnClose, setActionOnClose] = useState<(() => void) | undefined>(
    undefined
  );
  const [onConfirm, setOnConfirm] = useState<
    ((data?: any) => void) | undefined
  >();

  // ✅ Actions được memoize - KHÔNG BAO GIỜ thay đổi reference
  const actions = useMemo<DialogActions>(
    () => ({
      openDialog: ({
        title,
        content,
        dialogSize,
        onConfirm,
        customTitle,
        customActions,
        ActionOnClose,
      }: OpenDialogOptions) => {
        setTitle(title ?? "");
        setContent(content);
        setDialogSize(dialogSize);
        setOnConfirm(() => onConfirm);
        setCustomTitle(() => customTitle);
        setCustomActions(() => customActions);
        setActionOnClose(() => ActionOnClose);
        setOpen(true);
      },
      closeDialog: () => {
        setOpen(false);
        // Dùng callback để access ActionOnClose state mới nhất
        setActionOnClose((currentActionOnClose) => {
          setTimeout(() => {
            setTitle("");
            setContent(null);
            setDialogSize(undefined);
            setCustomTitle(undefined);
            setCustomActions(undefined);
            setOnConfirm(undefined);
            if (currentActionOnClose) {
              currentActionOnClose();
            }
            setActionOnClose(undefined);
          }, 300);
          return currentActionOnClose;
        });
      },
    }),
    [] // ← Empty deps - actions STABLE
  );

  // ✅ State - Chỉ GlobalDialog subscribe
  const state = useMemo<DialogState>(
    () => ({
      open,
      title,
      content,
      dialogSize,
      onConfirm,
      customTitle,
      customActions,
      ActionOnClose,
    }),
    [open, title, content, dialogSize, onConfirm, customTitle, customActions, ActionOnClose]
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
