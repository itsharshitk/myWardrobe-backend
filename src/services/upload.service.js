import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "wardrobe",
                resource_type: "image",
                timeout: 60 * 1000,
                connection_timeout: 10000
            },
            (error, result) => {
                if(error) {
                    return reject(error);
                }

                return resolve(result);
            }
        )

        stream.end(buffer);
        // Readable.from(buffer).pipe(stream);
    })
}
