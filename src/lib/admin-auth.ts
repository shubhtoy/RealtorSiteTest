type PasswordEnvKey = `VITE_${string}`;

export class AdminAuthService {
  static getPassword(keys: PasswordEnvKey[], fallback = ""): string {
    const env = import.meta.env as Record<string, string | undefined>;

    for (const key of keys) {
      const value = env[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
    }

    return fallback.trim();
  }

  static buildToken(password: string): string {
    if (typeof window === "undefined") return "";
    return window.btoa(password);
  }

  static verifyPassword(input: string, expected: string): boolean {
    // Constant-time comparison to avoid leaking prefix matches via timing.
    const inputBytes = new TextEncoder().encode(input);
    const expectedBytes = new TextEncoder().encode(expected);
    const maxLength = Math.max(inputBytes.length, expectedBytes.length);

    let diff = inputBytes.length ^ expectedBytes.length;

    for (let index = 0; index < maxLength; index += 1) {
      diff |= (inputBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
    }

    return diff === 0;
  }
}
