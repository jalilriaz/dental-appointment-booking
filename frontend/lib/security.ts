import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Generates a cryptographically strong, random hashed password for auto-created patient accounts.
 * Prevents account takeover via predictable default passwords.
 */
export async function generateRandomPatientPasswordHash(): Promise<string> {
    const randomSecret = crypto.randomBytes(32).toString("hex");
    return bcrypt.hash(randomSecret, 10);
}
