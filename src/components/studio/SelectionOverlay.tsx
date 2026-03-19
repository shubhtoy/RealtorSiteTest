import { ReactNode, useCallback, useEffect, useRef } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { EDITABLE_COMPONENTS } from "@/config/editable-components";

type SelectionOverlayProps = {
  children: ReactNode;
};

export default function SelectionOverlay({ children }: SelectionOverlayProps) {
  const { isEditing, interactionMode, selectedComponent, setSelectedComponent } = useEditMode();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle click on editable components
  const handleClick = useCallback((event: MouseEvent) => {
    if (!isEditing || interactionMode !== "select") return;

    // Find if clicked element is inside an editable component
    const target = event.target as HTMLElement;
    if (target.closest("[data-puck-panel]") || target.closest("[data-edit-ui]")) {
      return;
    }
    
    for (const component of EDITABLE_COMPONENTS) {
      const editableElement = target.closest(component.selector);
      if (editableElement) {
        event.preventDefault();
        event.stopPropagation();
        
        // Get component props using extractProps function if available
        let props: Record<string, unknown> = {};
        if (component.extractProps) {
          props = component.extractProps(editableElement as HTMLElement);
        } else {
          // Fallback: get props from data attributes
          const dataProps = editableElement.getAttribute('data-props');
          if (dataProps) {
            try {
              const parsed = JSON.parse(dataProps) as unknown;
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                Object.assign(props, parsed);
              }
            } catch {
              // Ignore malformed payloads and keep empty props fallback.
            }
          }
        }

        setSelectedComponent({
          id: `${component.type}-${Date.now()}`,
          type: component.type,
          props,
          path: component.path,
        });
        return;
      }
    }

  }, [isEditing, interactionMode, setSelectedComponent]);

  // Add click listener when in edit mode
  useEffect(() => {
    if (!isEditing || interactionMode !== "select") return;

    const handleDocumentClick = (event: MouseEvent) => {
      handleClick(event);
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isEditing, interactionMode, handleClick]);

  // Add visual indicators for editable components
  useEffect(() => {
    if (!isEditing || interactionMode !== "select" || !overlayRef.current) return;

    const cleanupFunctions: (() => void)[] = [];

    EDITABLE_COMPONENTS.forEach(component => {
      const elements = document.querySelectorAll(component.selector);
      elements.forEach(element => {
        const el = element as HTMLElement;
        
        // Add hover effect
        const originalCursor = el.style.cursor;
        el.style.cursor = 'pointer';
        el.style.transition = 'outline 0.2s ease';
        
        // Add outline on hover
        const handleMouseEnter = () => {
          if (isEditing) {
            el.style.outline = '2px dashed #3b82f6';
            el.style.outlineOffset = '4px';
          }
        };
        
        const handleMouseLeave = () => {
          el.style.outline = '';
          el.style.outlineOffset = '';
        };
        
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        
        cleanupFunctions.push(() => {
          el.style.cursor = originalCursor;
          el.style.transition = '';
          el.style.outline = '';
          el.style.outlineOffset = '';
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [isEditing, interactionMode]);

  // Highlight selected component
  useEffect(() => {
    if (!isEditing || !selectedComponent) return;

    const selectedType = EDITABLE_COMPONENTS.find(c => c.type === selectedComponent.type);
    if (!selectedType) return;

    const elements = document.querySelectorAll(selectedType.selector);
    elements.forEach(element => {
      const el = element as HTMLElement;
      el.style.outline = '2px solid #10b981';
      el.style.outlineOffset = '4px';
      el.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
    });

    return () => {
      elements.forEach(element => {
        const el = element as HTMLElement;
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.boxShadow = '';
      });
    };
  }, [isEditing, selectedComponent]);

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div ref={overlayRef} className="relative">
      {children}
      
      {/* Edit mode indicator */}
      <div
        className={`fixed top-4 right-4 z-50 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg ${
          interactionMode === "select" ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        {interactionMode === "select" ? "Select Mode" : "Normal Mode"}
      </div>
    </div>
  );
}