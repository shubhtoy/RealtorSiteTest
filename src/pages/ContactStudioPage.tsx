import { Puck, blocksPlugin, fieldsPlugin, outlinePlugin } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useEditableContent } from "@/context/EditableContentContext";
import { keyValueField, stringListField, visibilityField } from "@/components/studio/PuckCustomFields";
import { AdminAuthService } from "@/lib/admin-auth";
import { STUDIO_PASSWORD } from "@/config/studio-auth";
import { coerceEditableSiteDocument, validateEditableSiteDocument } from "@/lib/editable-content-store";
import { PuckDataService } from "@/lib/puck-data";

const ADMIN_AUTH_STORAGE_KEY = "baba.admin.contact-studio.unlocked";
type PuckIncomingData = { content?: unknown };

type PuckPermissionState = {
  drag: boolean;
  duplicate: boolean;
  delete: boolean;
  edit: boolean;
  insert: boolean;
};

type ActionEntry = {
  id: number;
  type: string;
  time: string;
};

function PreviewCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="cursor-pointer rounded-xl border border-border bg-panel-gradient p-4 shadow-soft transition hover:border-primary/35 hover:shadow-soft-lg">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">Contact Studio Block</p>
      <h3 className="mt-1 font-display text-lg leading-tight text-foreground">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export default function ContactStudioPage() {
  const { draft, mode, setMode, updateDraft, publish, revertDraft, exportDraftJson } = useEditableContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string>("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return STUDIO_PASSWORD.length > 0 && window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === AdminAuthService.buildToken(STUDIO_PASSWORD);
  });

  const [sidebarSide, setSidebarSide] = useState<"left" | "right">("right");
  const [useBlocksRail, setUseBlocksRail] = useState(true);
  const [iframeEnabled, setIframeEnabled] = useState(true);
  const [iframeWaitForStyles, setIframeWaitForStyles] = useState(true);
  const [permissions, setPermissions] = useState<PuckPermissionState>({
    drag: true,
    duplicate: true,
    delete: true,
    edit: true,
    insert: true,
  });
  const [actionFeed, setActionFeed] = useState<ActionEntry[]>([]);

  const config = useMemo(
    () => ({
      components: {
        ContactHero: {
          fields: {
            heroEyebrow: { type: "text", label: "Hero Eyebrow" },
            heroTitle: { type: "text", label: "Hero Title" },
            heroDescription: { type: "textarea", label: "Hero Description" },
            heroImage: { type: "text", label: "Hero Image" },
            mapEmbedUrl: { type: "text", label: "Map Embed URL" },
          },
          render: (props: any) => (
            <section className="cursor-pointer rounded-2xl border border-border bg-panel-gradient p-5 shadow-soft transition hover:border-primary/35">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">Hero</p>
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{props?.heroEyebrow ?? "Contact & Leasing"}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight">{props?.heroTitle ?? "Book a Tour"}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{props?.heroDescription ?? "Hero description"}</p>
              <div className="mt-4 rounded-lg border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground">
                <p>Image: {props?.heroImage ?? draft.contact.heroImage}</p>
                <p className="mt-1">Map URL: {props?.mapEmbedUrl ?? draft.contact.mapEmbedUrl}</p>
              </div>
            </section>
          ),
        },
        ContactOfficeHours: {
          fields: {
            officeHoursTitle: { type: "text", label: "Office Hours Title" },
            officeHoursJson: stringListField("Office Hours"),
          },
          render: (props: any) => {
            const officeHours = PuckDataService.parseArray(props?.officeHoursJson, draft.contact.officeHours);
            return (
              <section className="cursor-pointer rounded-xl border border-border bg-panel-gradient p-5 shadow-soft transition hover:border-primary/35">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">Office Hours</p>
                <h3 className="mt-2 font-display text-xl">{props?.officeHoursTitle ?? "Office Hours"}</h3>
                <ul className="mt-3 grid gap-2">
                  {officeHours.map((line, idx) => (
                    <li key={`${line}-${idx}`} className="rounded-full border border-border px-3 py-1 text-xs">
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            );
          },
        },
        ContactFormContent: {
          fields: {
            tourFormTitle: { type: "text", label: "Form Title" },
            tourFormDescription: { type: "textarea", label: "Form Description" },
            submitText: { type: "text", label: "Submit Button Text" },
            formEyebrow: { type: "text", label: "Form Eyebrow" },
            infoBulletsJson: stringListField("Info Bullets"),
            featureBadgesJson: stringListField("Feature Badges"),
          },
          render: (props: any) => {
            const bullets = PuckDataService.parseArray(props?.infoBulletsJson, draft.contact.ui.infoBullets);
            const badges = PuckDataService.parseArray(props?.featureBadgesJson, draft.contact.ui.featureBadges);
            return (
              <section className="cursor-pointer rounded-2xl border border-border bg-panel-gradient p-5 shadow-soft transition hover:border-primary/35">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">Form Content</p>
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{props?.formEyebrow ?? draft.contact.ui.formEyebrow}</p>
                <h3 className="mt-2 font-display text-2xl">{props?.tourFormTitle ?? "Schedule Your Tour"}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{props?.tourFormDescription ?? "Form description"}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                  {bullets.map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {badges.map((badge, idx) => (
                    <span key={`${badge}-${idx}`} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{badge}</span>
                  ))}
                </div>
                <button type="button" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                  {props?.submitText ?? "Submit"}
                </button>
              </section>
            );
          },
        },
        ContactFormOptions: {
          fields: {
            bedroomOptionsJson: stringListField("Bedroom Options"),
            moveInOptionsJson: stringListField("Move-In Options"),
            tourTypeOptionsJson: stringListField("Tour Type Options"),
          },
          render: (props: any) => {
            const bedroom = PuckDataService.parseArray(props?.bedroomOptionsJson, draft.contact.formOptions.bedroom);
            const moveIn = PuckDataService.parseArray(props?.moveInOptionsJson, draft.contact.formOptions.moveIn);
            const tourType = PuckDataService.parseArray(props?.tourTypeOptionsJson, draft.contact.formOptions.tourType);

            return (
              <section className="cursor-pointer rounded-xl border border-border bg-panel-gradient p-5 shadow-soft transition hover:border-primary/35">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">Form Options</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Bedroom</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {bedroom.map((item, idx) => <span key={`${item}-${idx}`} className="rounded-full border border-border px-2 py-1 text-xs">{item}</span>)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Move In</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {moveIn.map((item, idx) => <span key={`${item}-${idx}`} className="rounded-full border border-border px-2 py-1 text-xs">{item}</span>)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Tour Type</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tourType.map((item, idx) => <span key={`${item}-${idx}`} className="rounded-full border border-border px-2 py-1 text-xs">{item}</span>)}
                    </div>
                  </div>
                </div>
              </section>
            );
          },
        },
        ContactUiLabels: {
          fields: {
            labelsJson: keyValueField("Form Labels"),
            placeholdersJson: keyValueField("Field Placeholders"),
            callButtonPrefix: { type: "text", label: "Call Button Prefix" },
            browseButtonText: { type: "text", label: "Browse Button Text" },
          },
          render: () => <PreviewCard title="UI Labels & Placeholders" subtitle="Form labels, placeholders, and CTA copy" />,
        },
        ContactVisibility: {
          fields: {
            contactSectionVisibilityJson: visibilityField("Section Visibility"),
          },
          render: () => <PreviewCard title="Section Visibility" subtitle="Toggle Hero and Form sections" />,
        },
      },
    }),
    [draft],
  );

  const data = useMemo(
    () => ({
      content: [
        {
          type: "ContactHero",
          props: {
            id: "contact-hero",
            heroEyebrow: draft.contact.heroEyebrow,
            heroTitle: draft.contact.heroTitle,
            heroDescription: draft.contact.heroDescription,
            heroImage: draft.contact.heroImage,
            mapEmbedUrl: draft.contact.mapEmbedUrl,
          },
        },
        {
          type: "ContactOfficeHours",
          props: {
            id: "contact-office-hours",
            officeHoursTitle: draft.contact.officeHoursTitle,
            officeHoursJson: JSON.stringify(draft.contact.officeHours, null, 2),
          },
        },
        {
          type: "ContactFormContent",
          props: {
            id: "contact-form-content",
            tourFormTitle: draft.contact.tourFormTitle,
            tourFormDescription: draft.contact.tourFormDescription,
            submitText: draft.contact.submitText,
            formEyebrow: draft.contact.ui.formEyebrow,
            infoBulletsJson: JSON.stringify(draft.contact.ui.infoBullets, null, 2),
            featureBadgesJson: JSON.stringify(draft.contact.ui.featureBadges, null, 2),
          },
        },
        {
          type: "ContactFormOptions",
          props: {
            id: "contact-form-options",
            bedroomOptionsJson: JSON.stringify(draft.contact.formOptions.bedroom, null, 2),
            moveInOptionsJson: JSON.stringify(draft.contact.formOptions.moveIn, null, 2),
            tourTypeOptionsJson: JSON.stringify(draft.contact.formOptions.tourType, null, 2),
          },
        },
        {
          type: "ContactUiLabels",
          props: {
            id: "contact-ui-labels",
            labelsJson: JSON.stringify(draft.contact.ui.labels, null, 2),
            placeholdersJson: JSON.stringify(draft.contact.ui.placeholders, null, 2),
            callButtonPrefix: draft.contact.ui.callButtonPrefix,
            browseButtonText: draft.contact.ui.browseButtonText,
          },
        },
        {
          type: "ContactVisibility",
          props: {
            id: "contact-visibility",
            contactSectionVisibilityJson: JSON.stringify(draft.contact.sectionVisibility, null, 2),
          },
        },
      ],
      root: { props: {} },
    }),
    [draft],
  );

  const plugins = useMemo(() => {
    const base = [outlinePlugin(), fieldsPlugin({ desktopSideBar: sidebarSide })];
    return useBlocksRail ? [blocksPlugin(), ...base] : base;
  }, [sidebarSide, useBlocksRail]);

  const viewports = useMemo(
    () => [
      { width: 390, label: "Phone" },
      { width: 768, label: "Tablet" },
      { width: 1280, label: "Desktop" },
      { width: "100%", label: "Fluid" },
    ],
    [],
  );

  const applyPuckData = (nextData: PuckIncomingData, errorPrefix: string) => {
    const heroEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactHero");
    const officeHoursEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactOfficeHours");
    const formContentEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactFormContent");
    const formOptionsEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactFormOptions");
    const labelsEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactUiLabels");
    const visibilityEntry = PuckDataService.getEntryProps<Record<string, any>>(nextData, "ContactVisibility");

    const next = {
      ...draft,
      contact: {
        ...draft.contact,
        heroEyebrow: heroEntry?.heroEyebrow ?? draft.contact.heroEyebrow,
        heroTitle: heroEntry?.heroTitle ?? draft.contact.heroTitle,
        heroDescription: heroEntry?.heroDescription ?? draft.contact.heroDescription,
        heroImage: heroEntry?.heroImage ?? draft.contact.heroImage,
        mapEmbedUrl: heroEntry?.mapEmbedUrl ?? draft.contact.mapEmbedUrl,
        officeHoursTitle: officeHoursEntry?.officeHoursTitle ?? draft.contact.officeHoursTitle,
        officeHours: PuckDataService.parseArray(officeHoursEntry?.officeHoursJson as string | undefined, draft.contact.officeHours),
        tourFormTitle: formContentEntry?.tourFormTitle ?? draft.contact.tourFormTitle,
        tourFormDescription: formContentEntry?.tourFormDescription ?? draft.contact.tourFormDescription,
        submitText: formContentEntry?.submitText ?? draft.contact.submitText,
        formOptions: {
          bedroom: PuckDataService.parseArray(formOptionsEntry?.bedroomOptionsJson as string | undefined, draft.contact.formOptions.bedroom),
          moveIn: PuckDataService.parseArray(formOptionsEntry?.moveInOptionsJson as string | undefined, draft.contact.formOptions.moveIn),
          tourType: PuckDataService.parseArray(formOptionsEntry?.tourTypeOptionsJson as string | undefined, draft.contact.formOptions.tourType),
        },
        sectionVisibility: {
          ...draft.contact.sectionVisibility,
          ...PuckDataService.parseObject(visibilityEntry?.contactSectionVisibilityJson as string | undefined, draft.contact.sectionVisibility),
        },
        ui: {
          ...draft.contact.ui,
          formEyebrow: formContentEntry?.formEyebrow ?? draft.contact.ui.formEyebrow,
          infoBullets: PuckDataService.parseArray(formContentEntry?.infoBulletsJson as string | undefined, draft.contact.ui.infoBullets),
          featureBadges: PuckDataService.parseArray(formContentEntry?.featureBadgesJson as string | undefined, draft.contact.ui.featureBadges),
          callButtonPrefix: labelsEntry?.callButtonPrefix ?? draft.contact.ui.callButtonPrefix,
          browseButtonText: labelsEntry?.browseButtonText ?? draft.contact.ui.browseButtonText,
          labels: {
            ...draft.contact.ui.labels,
            ...PuckDataService.parseObject(labelsEntry?.labelsJson as string | undefined, draft.contact.ui.labels),
          },
          placeholders: {
            ...draft.contact.ui.placeholders,
            ...PuckDataService.parseObject(labelsEntry?.placeholdersJson as string | undefined, draft.contact.ui.placeholders),
          },
        },
      },
    };

    const validation = validateEditableSiteDocument(next);
    if (!validation.valid) {
      setImportMessage(`${errorPrefix}: ${validation.errors[0]}`);
      return;
    }

    updateDraft(next);
  };

  const onPublish = (nextData: PuckIncomingData) => {
    applyPuckData(nextData, "Publish blocked");
  };

  const onChange = (nextData: PuckIncomingData) => {
    applyPuckData(nextData, "Edit blocked");
  };

  const onAction = (action: { type?: unknown }) => {
    const entry = {
      id: Date.now(),
      type: String(action?.type ?? "unknown"),
      time: new Date().toLocaleTimeString(),
    };
    setActionFeed((prev) => [entry, ...prev].slice(0, 12));
  };

  const downloadDraftJson = () => {
    const json = exportDraftJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "editable-content.contact-studio.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const { document, errors } = coerceEditableSiteDocument(parsed);
      if (!document) {
        setImportMessage(`Import failed: ${errors[0] ?? "invalid JSON structure"}.`);
        return;
      }

      updateDraft(document);
      setImportMessage("Draft imported successfully.");
    } catch {
      setImportMessage("Import failed: unable to parse JSON file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!STUDIO_PASSWORD) {
      setAuthError("Studio password is not configured.");
      return;
    }

    if (!AdminAuthService.verifyPassword(password, STUDIO_PASSWORD)) {
      setAuthError("Wrong password. Please try again.");
      return;
    }

    setAuthError("");
    setPassword("");
    setIsUnlocked(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, AdminAuthService.buildToken(STUDIO_PASSWORD));
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  };

  const togglePermission = (key: keyof PuckPermissionState) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isUnlocked) {
    return (
      <main className="bg-body-mesh py-16 md:py-24">
        <section className="mx-auto w-[min(560px,92vw)]">
          <div className="rounded-2xl border border-border bg-panel-gradient p-6 shadow-soft md:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">Contact Studio</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Enter Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">This page is locked. Enter the admin password to open contact editing studio.</p>

            <form className="mt-6 grid gap-3" onSubmit={handleUnlock}>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">Password</span>
                <input
                  type="password"
                  className="h-10 rounded-md border border-border bg-background px-3"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>

              {authError ? <p className="text-sm text-destructive">{authError}</p> : null}

              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Unlock Contact Studio
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-8">
      <div className="mx-auto grid w-[min(1600px,96vw)] gap-3 py-3">
        <div className="rounded-xl border border-border bg-panel-gradient p-3 shadow-soft">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMode("published")}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  mode === "published" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                Live View
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  mode === "preview" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                Preview Draft
              </button>
              <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                onClick={revertDraft}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Revert Draft
              </button>
              <button
                type="button"
                onClick={publish}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground"
              >
                Publish Draft
              </button>
              <button
                type="button"
                onClick={downloadDraftJson}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Import JSON
              </button>
              <button
                type="button"
                onClick={handleLock}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Lock
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">Sidebar</span>
              <button
                type="button"
                onClick={() => setSidebarSide("left")}
                className={`rounded-full px-3 py-1.5 font-semibold uppercase tracking-[0.12em] ${sidebarSide === "left" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => setSidebarSide("right")}
                className={`rounded-full px-3 py-1.5 font-semibold uppercase tracking-[0.12em] ${sidebarSide === "right" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
              >
                Right
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <input type="checkbox" checked={useBlocksRail} onChange={(event) => setUseBlocksRail(event.target.checked)} />
              Blocks Rail
            </label>

            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <input type="checkbox" checked={iframeEnabled} onChange={(event) => setIframeEnabled(event.target.checked)} />
                iframe
              </label>
              <label className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={iframeWaitForStyles}
                  disabled={!iframeEnabled}
                  onChange={(event) => setIframeWaitForStyles(event.target.checked)}
                />
                wait styles
              </label>
            </div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-background/60 p-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">Permissions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(permissions) as Array<keyof PuckPermissionState>).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => togglePermission(key)}
                    className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${permissions[key] ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/60 p-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">Canvas Guidance</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Cursor editing is active. Click any card in the canvas to select it and edit fields in the side panel.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/60 p-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">Action Feed</p>
              <div className="mt-2 max-h-24 overflow-auto rounded-md border border-border/60 bg-background/60 p-2 text-xs">
                {actionFeed.length === 0 ? (
                  <p className="text-muted-foreground">No actions yet.</p>
                ) : (
                  actionFeed.map((entry) => (
                    <p key={entry.id} className="py-0.5 text-foreground/85">
                      {entry.time} • {entry.type}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {importMessage ? (
          <div className="text-xs text-muted-foreground">{importMessage}</div>
        ) : null}

        <div className="min-w-0 overflow-hidden rounded-xl border border-border">
          <Puck
            config={config as any}
            data={data as any}
            onPublish={onPublish}
            onChange={onChange}
            onAction={onAction}
            plugins={plugins as any}
            permissions={permissions}
            viewports={viewports as any}
            iframe={{ enabled: iframeEnabled, waitForStyles: iframeWaitForStyles }}
            headerTitle="Contact Content Studio"
            headerPath="/contact"
            height="78vh"
          />
        </div>
      </div>
    </main>
  );
}
