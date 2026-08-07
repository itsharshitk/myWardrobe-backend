import sharp from "sharp";
import logger from "../config/logger.js";

const processBuffer = async (buffer) => {
    return await sharp(buffer)
        .resize(500, 500, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .jpeg({
            quality: 80
        })
        .toBuffer();
}

export default processBuffer;