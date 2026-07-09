const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateUploadedFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: "Invalid file type. Only JPG, PNG, and PDF are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "File exceeds 10MB limit." };
  }

  return { isValid: true };
}
