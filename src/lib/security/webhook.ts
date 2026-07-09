import crypto from "crypto";
import { env } from "@/lib/env";

/**
 * Validates a standard webhook signature
 * Useful for any service sending an HMAC signature
 */
export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload, "utf8")
      .digest("hex");
    
    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (err) {
    return false;
  }
}
