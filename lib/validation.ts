// Slug: lowercase alphanumeric + hyphens, no leading/trailing hyphen, 3-63 chars
const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;

const RESERVED_SLUGS = [
  "www",
  "api",
  "app",
  "admin",
  "cdn",
  "mail",
  "help",
  "support",
  "status",
];

export interface SlugValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSlug(slug: string): SlugValidationResult {
  if (slug.length < 3 || slug.length > 63) {
    return {
      valid: false,
      error:
        "Slug must be 3-63 lowercase alphanumeric characters or hyphens, and cannot start/end with a hyphen",
    };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      valid: false,
      error:
        "Slug must be 3-63 lowercase alphanumeric characters or hyphens, and cannot start/end with a hyphen",
    };
  }

  if (RESERVED_SLUGS.includes(slug)) {
    return {
      valid: false,
      error: "This slug is reserved. Please choose a different one.",
    };
  }

  return { valid: true };
}

export function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `rd_${hex}`;
}
