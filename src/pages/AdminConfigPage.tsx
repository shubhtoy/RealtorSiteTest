import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import type { SiteConfig } from "@/types/siteConfig";
import { AdminAuthService } from "@/lib/admin-auth";
import { STUDIO_PASSWORD } from "@/config/studio-auth";

const ADMIN_AUTH_STORAGE_KEY = "baba.admin.config.unlocked";

export default function AdminConfigPage() {
  const { config, source, updateLocalConfig, resetLocalConfig } = useSiteConfig();
  const [form, setForm] = useState<SiteConfig>(config);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setForm(config);
  }, [config]);

  useEffect(() => {
    const unlocked = STUDIO_PASSWORD.length > 0 && window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === AdminAuthService.buildToken(STUDIO_PASSWORD);
    setIsUnlocked(unlocked);
  }, []);

  const sourceLabel = useMemo(() => {
    if (source === "local") return "Local admin override";
    return "Default code config";
  }, [source]);

  const setField =
    (field: keyof SiteConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateLocalConfig(form);
  };

  const handleReset = () => {
    resetLocalConfig();
    setForm(config);
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
    setIsUnlocked(true);
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, AdminAuthService.buildToken(STUDIO_PASSWORD));
    setPassword("");
  };

  const handleLock = () => {
    setIsUnlocked(false);
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  };

  if (!isUnlocked) {
    return (
      <main className="bg-body-mesh py-16 md:py-24">
        <section className="mx-auto w-[min(560px,92vw)]">
          <div className="rounded-2xl border border-border bg-panel-gradient p-6 shadow-soft md:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">Protected</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Enter Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">This page is locked. Enter the admin password to edit site configuration.</p>

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
                Unlock Editor
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-body-mesh py-16 md:py-24">
      <section className="mx-auto w-[min(900px,92vw)]">
        <div className="rounded-2xl border border-border bg-panel-gradient p-6 shadow-soft md:p-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">Admin</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Site Configuration</h1>
          <p className="mt-2 text-sm text-muted-foreground">Current source: {sourceLabel}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground/90">
            <p>Edit from this hidden page only: /edit or /admin/config. Click Save Config to apply immediately.</p>
            <button type="button" onClick={handleLock} className="rounded-full border border-border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground">
              Lock
            </button>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Site Name</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.siteName} onChange={setField("siteName")} />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Tagline</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.tagline} onChange={setField("tagline")} />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">City Label</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.cityLabel} onChange={setField("cityLabel")} />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Description</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.description} onChange={setField("description")} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">Phone</span>
                <input className="h-10 rounded-md border border-border bg-background px-3" value={form.phone} onChange={setField("phone")} />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">Email</span>
                <input className="h-10 rounded-md border border-border bg-background px-3" value={form.email} onChange={setField("email")} />
              </label>
            </div>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Address</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.addressLine} onChange={setField("addressLine")} />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Hours</span>
              <input className="h-10 rounded-md border border-border bg-background px-3" value={form.hoursLine} onChange={setField("hoursLine")} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">Primary CTA Label</span>
                <input className="h-10 rounded-md border border-border bg-background px-3" value={form.navCtaText} onChange={setField("navCtaText")} />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">Primary CTA Link</span>
                <input className="h-10 rounded-md border border-border bg-background px-3" value={form.navCtaLink} onChange={setField("navCtaLink")} />
              </label>
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Save Config
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full border border-primary/40 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary"
              >
                Reset to Defaults
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
