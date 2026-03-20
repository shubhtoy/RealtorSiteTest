import { useState, useEffect } from "react";
import { Puck } from "@puckeditor/core";
import { toast } from "sonner";
import { useEditMode } from "@/context/EditModeContext";
import { useEditableContent } from "@/context/EditableContentContext";
import { EDITABLE_COMPONENTS } from "@/config/editable-components";
import "@puckeditor/core/puck.css";

type PuckIncomingData = {
  content?: Array<{
    type?: string;
    props?: Record<string, unknown>;
  }>;
};

type PuckPanelData = {
  content: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
};

// Mock Puck config for different component types

interface FloatingHeaderProps { siteName?: string; cityLabel?: string; tagline?: string; navCtaText?: string; navCtaLink?: string; [key: string]: unknown; }
interface FloatingFooterProps { siteName?: string; description?: string; phone?: string; email?: string; addressLine?: string; hoursLine?: string; [key: string]: unknown; }
interface FloatingHeroProps { title?: string; subtitle?: string; ctaText?: string; ctaLink?: string; [key: string]: unknown; }
interface FloatingFeaturesProps { sectionTitle?: string; [key: string]: unknown; }

const PUCK_CONFIG = {
  components: {
    SiteHeader: {
      fields: {
        siteName: { type: "text", label: "Site Name" },
        cityLabel: { type: "text", label: "City Label" },
        tagline: { type: "text", label: "Tagline" },
        navCtaText: { type: "text", label: "Nav CTA Text" },
        navCtaLink: { type: "text", label: "Nav CTA Link" },
      },
      render: ({ siteName = "Site Name", cityLabel = "City", tagline = "Tagline" }: FloatingHeaderProps) => (
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold">{siteName}</h3>
          <p className="text-sm text-gray-600">{cityLabel}</p>
          <p className="text-sm text-gray-500">{tagline}</p>
        </div>
      ),
    },
    SiteFooter: {
      fields: {
        siteName: { type: "text", label: "Site Name" },
        description: { type: "text", label: "Description" },
        phone: { type: "text", label: "Phone" },
        email: { type: "text", label: "Email" },
        addressLine: { type: "text", label: "Address" },
        hoursLine: { type: "text", label: "Hours" },
      },
      render: ({ siteName = "Site Name", description = "Description", phone = "Phone", email = "Email" }: FloatingFooterProps) => (
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold">{siteName}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-sm text-gray-500">{phone} • {email}</p>
        </div>
      ),
    },
    HomeHero: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        ctaText: { type: "text", label: "CTA Text" },
        ctaLink: { type: "text", label: "CTA Link" },
      },
      render: ({ title = "Hero Title", subtitle = "Hero subtitle" }: FloatingHeroProps) => (
        <div className="p-4 border rounded bg-blue-50">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      ),
    },
    HomeFeatures: {
      fields: {
        sectionTitle: { type: "text", label: "Section Title" },
        featuresJson: { 
          type: "custom", 
          label: "Features",
          render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <div className="space-y-2">
              <textarea 
                className="w-full p-2 border rounded text-sm"
                value={value || "[]"}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500">Enter JSON array of features</p>
            </div>
          )
        },
      },
      render: ({ sectionTitle = "Features" }: FloatingFeaturesProps) => (
        <div className="p-4 border rounded bg-green-50">
          <h3 className="font-bold">{sectionTitle}</h3>
        </div>
      ),
    },
  },
};

export default function FloatingPuckPanel() {
  const { isEditing, selectedComponent, setSelectedComponent } = useEditMode();
  const { draft, updateDraft } = useEditableContent();
  const [panelPosition, setPanelPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const stopEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  // Handle drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPanelPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isEditing || !selectedComponent) {
    return null;
  }

  const componentConfig = (PUCK_CONFIG.components as Record<string, unknown>)[selectedComponent.type];
  if (!componentConfig) {
    return (
      <div 
        data-puck-panel
        className="fixed z-[100] w-80 rounded-lg border border-gray-300 bg-white shadow-xl"
        style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
        onMouseDown={stopEventPropagation}
        onClick={stopEventPropagation}
      >
        <div className="flex items-center justify-between border-b p-3 bg-gray-50 rounded-t-lg cursor-move"
             onMouseDown={handleDragStart}>
          <h3 className="font-medium text-gray-800">Edit Component</h3>
          <button 
            onClick={() => setSelectedComponent(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            No editor configuration found for <strong>{selectedComponent.type}</strong>.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Add this component type to the Puck config.
          </p>
        </div>
      </div>
    );
  }

  // Create Puck data structure for the selected component
  const puckData: PuckPanelData = {
    content: [
      {
        type: selectedComponent.type,
        props: selectedComponent.props,
      },
    ],
  };

  const handlePuckChange = (data: PuckIncomingData) => {
    if (data?.content?.[0] && selectedComponent) {
      const updatedProps = data.content[0].props ?? {};

      const getStringProp = (key: string, fallback: string) => {
        const value = updatedProps[key];
        return typeof value === "string" && value.trim().length > 0 ? value : fallback;
      };
      
      // Update the selected component with new props
      setSelectedComponent({
        ...selectedComponent,
        props: updatedProps,
      });

      // Update the actual draft data based on component path
      const updatedDraft = { ...draft };
      
      // Map component path to draft structure
      const pathParts = selectedComponent.path.split('.');
      if (pathParts[0] === 'global' && pathParts[1] === 'header') {
        // Update global.header fields
        if (updatedDraft.global) {
          updatedDraft.global.siteName = getStringProp("siteName", updatedDraft.global.siteName);
          updatedDraft.global.cityLabel = getStringProp("cityLabel", updatedDraft.global.cityLabel);
          updatedDraft.global.tagline = getStringProp("tagline", updatedDraft.global.tagline);
          updatedDraft.global.navCtaText = getStringProp("navCtaText", updatedDraft.global.navCtaText);
          updatedDraft.global.navCtaLink = getStringProp("navCtaLink", updatedDraft.global.navCtaLink);
        }
      } else if (pathParts[0] === 'global' && pathParts[1] === 'footer') {
        // Update global.footer fields
        if (updatedDraft.global) {
          updatedDraft.global.siteName = getStringProp("siteName", updatedDraft.global.siteName);
          updatedDraft.global.description = getStringProp("description", updatedDraft.global.description);
          updatedDraft.global.phone = getStringProp("phone", updatedDraft.global.phone);
          updatedDraft.global.email = getStringProp("email", updatedDraft.global.email);
          updatedDraft.global.addressLine = getStringProp("addressLine", updatedDraft.global.addressLine);
          updatedDraft.global.hoursLine = getStringProp("hoursLine", updatedDraft.global.hoursLine);
          // Note: footerBadges would need special handling
        }
      }
      
      // Save the updated draft
      updateDraft(updatedDraft);
      
      // Also update the DOM immediately for instant feedback
      const element = document.querySelector(`[data-editable="${selectedComponent.type.toLowerCase()}"]`);
      if (element) {
        // Find the component config and apply props
        const config = EDITABLE_COMPONENTS.find(c => c.type === selectedComponent.type);
        if (config && config.applyProps) {
          config.applyProps(element as HTMLElement, updatedProps);
        }
      }
    }
  };

  const handlePuckPublish = (data: PuckIncomingData) => {
    handlePuckChange(data);
    toast.success("Changes published to draft");
  };

  return (
    <div 
      data-puck-panel
      className="fixed z-[100] w-96 rounded-lg border border-gray-300 bg-white shadow-xl"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
      onMouseDown={stopEventPropagation}
      onClick={stopEventPropagation}
    >
      {/* Drag handle */}
      <div className="flex items-center justify-between border-b p-3 bg-gray-50 rounded-t-lg cursor-move"
           onMouseDown={handleDragStart}>
        <div>
          <h3 className="font-medium text-gray-800">Edit {selectedComponent.type}</h3>
          <p className="text-xs text-gray-500">{selectedComponent.path}</p>
        </div>
        <button 
          onClick={() => setSelectedComponent(null)}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          ✕
        </button>
      </div>

      {/* Puck editor — cast needed: Puck's Config generic requires exact field type matching incompatible with our dynamic config shape */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        <Puck
          config={PUCK_CONFIG as Parameters<typeof Puck>[0]["config"]}
          data={puckData}
          onPublish={handlePuckPublish}
          onChange={handlePuckChange}
        />
      </div>

      {/* Action buttons */}
      <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
        <button
          onClick={() => setSelectedComponent(null)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <div className="space-x-2">
          <button
            onClick={() => {
              handlePuckChange(puckData);
              toast.success("Saved to draft");
            }}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Draft
          </button>
          <button
            onClick={() => {
              handlePuckPublish(puckData);
            }}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}