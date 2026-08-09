// import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import logger from "../config/logger.js";

export const uploadImage = (buffer, folderName = "") => {
    return new Promise((resolve, reject) => {
        const folder = folderName ? `wardrobe/${folderName}` : "wardrobe";

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                timeout: 60 * 1000,
                connection_timeout: 10000
            },
            (error, result) => {
                if(error) {
                    logger.error({ err: error, folder }, "Image upload failed");
                    return reject(new ApiError(500, "Image upload failed"));
                }

                return resolve(result);
            }
        )

        stream.end(buffer);
        // Readable.from(buffer).pipe(stream);
    })
}

export const deleteImage = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(`Failed to delete image: ${publicId}`);
    }
};