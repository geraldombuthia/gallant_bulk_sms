/**
 * Xrisitics of a good API key
 * * Uniqueness
 * * Security
 * * Unpredicatability
 * * Expiration (limit compromised keys)
 * * Revocability (Invalidate and revoke keys)
 * * Permissions (Define scope of each key, minimize damage if compromised)
 * * Environment-specific (Limit keys to development, staging and prod)
 * * Logging and tracking Keys
 * * Use hashed comparison for API keys, do not store as plain text
 */

const crypto = require("crypto");

// Generate a secure random API key with metadata
function generateApiKey() {
    const randomPart = crypto.randomBytes(24).toString("hex");
    // const timestamp = Date.now().toString(36); // Base36 encoded timestamp

    // const apikey = `${userId}-${timestamp}-${randomPart}`;
    return randomPart;
}

module.exports = generateApiKey;