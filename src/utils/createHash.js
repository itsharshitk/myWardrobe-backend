import crypto from "node:crypto";

const createHash = (rawToken) => {
    return crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex")
}

export default createHash;