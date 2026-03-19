import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearLocalSiteConfig,
  defaultSiteConfig,
  mergeSiteConfig,
  readLocalSiteConfig,
  writeLocalSiteConfig,
} from "@/lib/site-config";
import type { SiteConfig, SiteConfigSource } from "@/types/siteConfig";

type SiteConfigContextValue = {
  config: SiteConfig;
  source: SiteConfigSource;
  updateLocalConfig: (next: SiteConfig) => void;
  resetLocalConfig: () => void;
};

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

function sanitizeConfig(input: Partial<SiteConfig> | null | undefined): Partial<SiteConfig> {
  if (!input) return {};

  const next: Partial<SiteConfig> = {};
  (Object.keys(defaultSiteConfig) as Array<keyof SiteConfig>).forEach((key) => {
    const value = input[key];
    if (typeof value === "string" && value.trim().length > 0) {
      next[key] = value;
    }
  });
  return next;
}

export function SiteConfigProvider({ children }: Props) {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [source, setSource] = useState<SiteConfigSource>("default");

  useEffect(() => {
    const localConfig = readLocalSiteConfig();
    if (!localConfig) return;
    setConfig(mergeSiteConfig(sanitizeConfig(localConfig)));
    setSource("local");
  }, []);

  const value = useMemo<SiteConfigContextValue>(
    () => ({
      config,
      source,
      updateLocalConfig: (next) => {
        const merged = mergeSiteConfig(sanitizeConfig(next));
        setConfig(merged);
        setSource("local");
        writeLocalSiteConfig(merged);
      },
      resetLocalConfig: () => {
        clearLocalSiteConfig();
        setConfig(defaultSiteConfig);
        setSource("default");
      },
    }),
    [config, source],
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return context;
}
