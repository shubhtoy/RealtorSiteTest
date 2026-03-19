import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? tabs[0]?.value} className={cn("", className)}>
      <TabsPrimitive.List className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="rounded-full border-[1.5px] border-primary/45 bg-card/90 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-widest text-primary cursor-pointer transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-sans"
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value}>
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
