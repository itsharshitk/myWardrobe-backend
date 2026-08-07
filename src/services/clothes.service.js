import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";
import processBuffer from "../utils/processImage.js";
import uploadImage from "./upload.service.js";
import clothesRepo from "../repositories/clothes.repository.js";

const add = async (user, body, files) => {
    try{
        const uploadPromises = files.map(async (file) => { 
            const processedBuffer = await processBuffer(file.buffer); // processing with sharp
            
            return uploadImage(processedBuffer, "clothes");
        });

        const uploadedImages = await Promise.all(uploadPromises);

        const clothesImage = uploadedImages.map((img) => ({
            url: img.secure_url,
            publicId: img.public_id,
            size: img.bytes,
            width: img.width,
            height: img.height
        }));

        const clothesData = {
            userId: user.id,
            ...body,
            clothesImage
        }

        const addedClothes = await clothesRepo.create(clothesData)

        return addedClothes;
    } catch(error) {
        logger.error({err: error}, "Failed to process or upload batch");

        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to process clothes images");
    }
   
}

const find = async (filters) => {
    return clothesRepo.findByFilters(filters);
}

export default { add, find };