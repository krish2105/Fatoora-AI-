/**
 * Strips out dangerous HTML tags from user input
 * For a real app, you would use a robust library like DOMPurify or sanitize-html
 */
export function sanitizeHtml(input: string | null | undefined): string | null {
  if (!input) return input || null;
  
  // Basic rudimentary protection (in production, use dompurify on the server)
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/onload="[^"]*"/gi, "")
    .replace(/onerror="[^"]*"/gi, "");
}

/**
 * Ensures text only contains safe standard characters 
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  // Keeps basic punctuation but strips control characters
  return input.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
}
