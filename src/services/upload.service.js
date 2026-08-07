// import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import logger from "../config/logger.js";

const uploadImage = (buffer, folder = "wardrobe") => {
    return new Promise((resolve, reject) => {
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

export default uploadImage;