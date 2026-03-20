import { createContext, useContext, useMemo, useState } from "react";
import {
  exportDraftAsJson,
  publishDraftDocument,
  readDraftDocument,
  readPublishedDocument,
  resetAllEditableContent,
  resetDraftToPublished,
  writeDraftDocument,
} from "@/lib/editable-content-store";
import { appEnv } from "@/config/env";
import type { EditableSiteDocument } from "@/types/editable-content";

type EditableMode = "published" | "preview";

type EditableContentContextValue = {
  mode: EditableMode;
  setMode: (mode: EditableMode) => void;
  published: EditableSiteDocument;
  draft: EditableSiteDocument;
  current: EditableSiteDocument;
  updateDraft: (next: EditableSiteDocument) => void;
  publish: () => void;
  revertDraft: () => void;
  resetAll: () => void;
  exportDraftJson: () => string;
};

const EditableContentContext = createContext<EditableContentContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export function EditableContentProvider({ children }: Props) {
  const [mode, setMode] = useState<EditableMode>("published");
  const [published, setPublished] = useState<EditableSiteDocument>(() => readPublishedDocument());
  const [draft, setDraft] = useState<EditableSiteDocument>(() => readDraftDocument());

  const value = useMemo<EditableContentContextValue>(
    () => ({
      mode,
      setMode,
      published,
      draft,
      current: mode === "preview" ? draft : published,
      updateDraft: (next) => {
        setDraft(next);
        writeDraftDocument(next);
      },
      publish: () => {
        publishDraftDocument(draft);
        setPublished(draft);

        // Persist to API server (non-blocking)
        const body = JSON.stringify(draft);
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "x-studio-password": appEnv.studioPassword,
        };
        fetch(`${appEnv.apiOrigin}/api/content/draft`, { method: "POST", headers, body })
          .then(() => fetch(`${appEnv.apiOrigin}/api/content/publish`, { method: "POST", headers }))
          .catch((err) => {
            console.warn("[EditableContentContext] Failed to persist publish to API server:", err);
          });
      },
      revertDraft: () => {
        resetDraftToPublished();
        const next = readDraftDocument();
        setDraft(next);
      },
      resetAll: () => {
        resetAllEditableContent();
        const nextPublished = readPublishedDocument();
        const nextDraft = readDraftDocument();
        setPublished(nextPublished);
        setDraft(nextDraft);
      },
      exportDraftJson: () => exportDraftAsJson(),
    }),
    [draft, mode, published],
  );

  return <EditableContentContext.Provider value={value}>{children}</EditableContentContext.Provider>;
}

export function useEditableContent() {
  const context = useContext(EditableContentContext);
  if (!context) {
    throw new Error("useEditableContent must be used within EditableContentProvider");
  }
  return context;
}
