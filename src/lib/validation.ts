export type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

export const validators = {
  required: (label: string): ValidationRule => ({
    validate: (v) => v.trim().length > 0,
    message: `${label} is required`,
  }),
  email: (): ValidationRule => ({
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "Enter a valid email address",
  }),
  phone: (): ValidationRule => ({
    validate: (v) => (v.match(/\d/g) || []).length >= 10,
    message: "Phone number must contain at least 10 digits",
  }),
};

export function validateField(
  value: string,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) return rule.message;
  }
  return null;
}
