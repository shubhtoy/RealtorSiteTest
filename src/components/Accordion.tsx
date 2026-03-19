import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("grid gap-3", className)}>
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`item-${i}`}
          className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/70 overflow-hidden"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-bold text-foreground text-[0.95rem] cursor-pointer font-sans">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-4 pb-3.5 text-muted-foreground text-[0.9rem] leading-relaxed">
              {item.answer}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
