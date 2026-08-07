import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";
import processBuffer from "../utils/processImage.js";
import uploadImage from "./upload.service.js";
import clothesRepo from "../repositories/clothes.repository.js";

// Add new clothes
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

// Fetch clothes based on Filters
const findByFilters = async (userId, queryParams) => {
    const allowedFilters = [
        "name",
        "category",
        "color",
        "brand",
        "size",
        "season",
        "occasion"
    ];

    const filters = {userId};

    for(const key of allowedFilters){
        if(queryParams[key] !== undefined){
            filters[key] = queryParams[key]
        }
    }

    if(queryParams.ai !== undefined){
        filters.aiGenerated = queryParams.ai === "true";
    }

    if(queryParams.fav !== undefined){
        filters.isFavourite = queryParams.fav === "true";
    }

    if(queryParams.archived !== undefined){
        filters.isArchived = queryParams.archived === "true";
    }

    return await clothesRepo.filter(filters);
}

const findById = async (userId, id) => {
    const clothes = await clothesRepo.findOneCloth(userId, id);

    if(!clothes){
        throw new ApiError(404, "No clothes found");
    }
    
    return clothes;
}

const updateClothById = async (id, userId, body, files) => {
    
    const updatedcloth = await clothesRepo.updateOneCloth(id, userId)

}

export default { add, findByFilters, findById, updateClothById };