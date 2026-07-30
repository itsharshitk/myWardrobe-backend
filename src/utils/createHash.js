import crypto from "node:crypto";

export const createHash = (rawToken) => {
    return crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex")
}