export type UnknownRecord = Record<string, unknown>;

export type PuckContentEntry = {
  type: string;
  props: UnknownRecord;
};

export class PuckDataService {
  static parseArray<T>(raw: string | undefined, fallback: T[]): T[] {
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }

  static parseObject<T extends UnknownRecord>(raw: string | undefined, fallback: T): T {
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return fallback;
      }
      return { ...fallback, ...(parsed as Partial<T>) };
    } catch {
      return fallback;
    }
  }

  static getEntries(data: unknown): PuckContentEntry[] {
    if (!data || typeof data !== "object") return [];
    const maybeContent = (data as { content?: unknown }).content;
    if (!Array.isArray(maybeContent)) return [];

    return maybeContent
      .filter((item): item is { type?: unknown; props?: unknown } => !!item && typeof item === "object")
      .map((item) => ({
        type: typeof item.type === "string" ? item.type : "",
        props: item.props && typeof item.props === "object" && !Array.isArray(item.props)
          ? (item.props as UnknownRecord)
          : {},
      }))
      .filter((item) => item.type.length > 0);
  }

  static getEntryProps<T extends UnknownRecord>(data: unknown, type: string): Partial<T> | undefined {
    const entry = this.getEntries(data).find((item) => item.type === type);
    return entry?.props as Partial<T> | undefined;
  }
}
