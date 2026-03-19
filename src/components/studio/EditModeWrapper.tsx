import { useEffect } from "react";
import { useEditMode } from "@/context/EditModeContext";
import SelectionOverlay from "./SelectionOverlay";
import FloatingPuckPanel from "./FloatingPuckPanel";

type EditModeWrapperProps = {
  children: React.ReactNode;
};

export default function EditModeWrapper({ children }: EditModeWrapperProps) {
  const { setMode } = useEditMode();

  // Enable edit mode when this wrapper is mounted
  useEffect(() => {
    setMode("edit");
    
    // Cleanup: disable edit mode when unmounted
    return () => {
      setMode("view");
    };
  }, [setMode]);

  return (
    <>
      {/* Wrap children with selection overlay for edit mode */}
      <SelectionOverlay>
        {children}
      </SelectionOverlay>
      
      {/* Floating Puck panel for editing selected components */}
      <FloatingPuckPanel />
    </>
  );
}