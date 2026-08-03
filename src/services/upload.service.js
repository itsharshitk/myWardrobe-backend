import Readable from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "wardrobe",
                timeout: 60 * 1000,
                resource_type: "image"
            },
            (error, result) => {
                if(error) {
                    return reject(error);
                }

                return resolve(result);
            }
        )

        Readable.from(buffer).pipe(stream);
    })
}
