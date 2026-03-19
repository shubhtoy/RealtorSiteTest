import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type EditMode = "view" | "edit";
type EditInteractionMode = "normal" | "select";

type SelectedComponent = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  path: string; // e.g., "home.hero" or "global.header"
} | null;

type EditModeContextValue = {
  mode: EditMode;
  setMode: (mode: EditMode) => void;
  interactionMode: EditInteractionMode;
  setInteractionMode: (mode: EditInteractionMode) => void;
  toggleInteractionMode: () => void;
  selectedComponent: SelectedComponent;
  setSelectedComponent: (component: SelectedComponent) => void;
  isEditing: boolean;
  toggleEditMode: () => void;
  // Helper to check if current URL path is in edit mode
  isEditPath: boolean;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export function EditModeProvider({ children }: Props) {
  const location = useLocation();
  const [mode, setMode] = useState<EditMode>("view");
  const [interactionMode, setInteractionMode] = useState<EditInteractionMode>("normal");
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(null);

  // Check if current path starts with /edit
  const isEditPath = location.pathname.startsWith("/edit");

  // Auto-enable edit mode when on edit path
  useEffect(() => {
    if (isEditPath && mode !== "edit") {
      setMode("edit");
    } else if (!isEditPath && mode === "edit") {
      setMode("view");
    }
  }, [isEditPath, mode]);

  // Keep interaction mode predictable when entering/leaving edit mode.
  useEffect(() => {
    if (mode === "edit") {
      setInteractionMode("select");
      return;
    }

    setInteractionMode("normal");
    setSelectedComponent(null);
  }, [mode]);

  const value = useMemo<EditModeContextValue>(
    () => ({
      mode,
      setMode,
      interactionMode,
      setInteractionMode,
      toggleInteractionMode: () =>
        setInteractionMode((prev) => (prev === "normal" ? "select" : "normal")),
      selectedComponent,
      setSelectedComponent,
      isEditing: mode === "edit",
      toggleEditMode: () => setMode((prev) => (prev === "view" ? "edit" : "view")),
      isEditPath,
    }),
    [mode, interactionMode, selectedComponent, isEditPath]
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}