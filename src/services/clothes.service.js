import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";
import processBuffer from "../utils/processImage.js";
import {uploadImage, deleteImage} from "./upload.service.js";
import clothesRepo from "../repositories/clothes.repository.js";
import aiUsageRepository from "../repositories/aiUsage.repository.js";
import createPaginationMeta from "../utils/paginationMeta.js";
import visionService from "../ai/vision.service.js";

// Add new clothes
const add = async (user, body, files) => {
    let uploadedImages;
    try{
        let clothesImage;
        let isAiGenerated = false;
        if(body.publicId && body.imageUrl){
            clothesImage = [{
                url: body.imageUrl,
                publicId: body.publicId,
            }],
            isAiGenerated = true
        }

        if(files?.length){
            const uploadPromises = files.map(async (file) => {
                const processedBuffer = await processBuffer(file.buffer); // processing with sharp
                
                return uploadImage(processedBuffer, "clothes");
            });
            
            uploadedImages = await Promise.all(uploadPromises);
            
            clothesImage = uploadedImages.map((img) => ({
                url: img.secure_url,
                publicId: img.public_id,
                size: img.bytes,
                width: img.width,
                height: img.height
            }));
        }

        const clothesData = {
            userId: user.id,
            ...body,
            aiGenerated: isAiGenerated,
            clothesImage
        }

        const addedClothes = await clothesRepo.create(clothesData)

        return addedClothes;
    } catch(error) {
        logger.error({err: error}, "Failed to process or upload batch");
        
        if(uploadedImages.length){
            await new Promise.allSettled(
                uploadedImages.map(img => deleteImage(img.publicId))
            );
        }

        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to process clothes images");
    }
}

// Fetch clothes based on Filters
const findByFilters = async (userId, queryParams, pagination) => {
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

    const {items, hasNextPage} = await clothesRepo.findPaginated(filters, pagination);

    const paginationMeta = createPaginationMeta({
        page: pagination.page,
        limit: pagination.limit,
        hasNextPage
    });

    return {
        clothes: items,
        pagination: paginationMeta
    }
}

// Fetch clothes based on Id
const findOneCloth = async (id, userId) => {
    const clothes = await clothesRepo.findById(id, userId);

    if(!clothes){
        throw new ApiError(404, "No clothes found");
    }
    
    return clothes;
}

// Update Clothes
const updateClothById = async (id, userId, body, files) => {
    try{
        const currentCloth = await clothesRepo.findById(id, userId);

        if(!currentCloth){
            throw new ApiError(404, "No clothes found");
        }        

        let newImages = [];

        if(files?.length){
            const uploadPromises = files.map(async (file) => {
                const processedBuffer = await processBuffer(file.buffer); // processing with sharp
                
                return uploadImage(processedBuffer, "clothes");
            });

            const uploadedImages = await Promise.all(uploadPromises);

            newImages = uploadedImages.map((img) => ({
                url: img.secure_url,
                publicId: img.public_id,
                size: img.bytes,
                width: img.width,
                height: img.height
            }));
        }

        // Separate keepImages from rest body data
        const {keepImages, ...updateData} = body; // remove keepImages from rest body

        const existingImages = currentCloth.clothesImage || [];

        // Match with existing images
        const keptImages = existingImages.filter((img) => {
            return keepImages.includes(img.publicId)
        });

        const removedImages = existingImages.filter((img) => {
            return !keepImages.includes(img.publicId)
        })

        // Deleting removed images from Cloudinary
        if(removedImages.length){
            await Promise.all(
                removedImages.map((img) =>{
                    return deleteImage(img.publicId)
                })
            )
        }

        updateData.clothesImage = [
            ...keptImages,
            ...newImages
        ]

        const updatedClothes = await clothesRepo.updateById(currentCloth._id, updateData, {returnDocument: "after"});

        return updatedClothes;
    } catch (error){
        logger.error({ err: error }, "Failed to update clothes");

        throw new ApiError(error.statusCode || 500, error.message || "Failed to update clothes");
    }
}


// Delete clothes By Id
const deleteClothesById = async (id, userId) => {
    const deletedClothes = await clothesRepo.deleteByIdAndUser(id, userId);

    if(!deletedClothes){
        throw new ApiError(404, "No clothes found");
    }

    const images = deletedClothes.clothesImage || [];

    // Cleanup images from Cloudinary
    if(images.length){
        const results = await Promise.allSettled(
            images.map((img) => deleteImage(img.publicId))
        );

        const failed = results.filter((result) => result.status === "rejected");

        if(failed.length){
            logger.error("Cloudinary images cleanup failed", {
                clothesId: id,
                userId,
                failedCount: failed.length,
                errors: failed.map((result) => result.reason),
            });
        }
    }

    return deletedClothes;
}

const analyzeClothing = async (fileBuffer, userId) => {
    let uploadedImg;
    try{
        const processedBuff = await processBuffer(fileBuffer);
        uploadedImg = await uploadImage(processedBuff);
        
        const analyzedData = await visionService.analyzeClothing(uploadedImg.secure_url);

        await aiUsageRepository.create(userId, analyzedData.usage);
        
        return {
            imageUrl: uploadedImg.secure_url,
            publicId: uploadedImg.public_id,
            data: analyzedData.data
        };
    } catch(error) {
        if (uploadedImg?.public_id) {
            try {
                await deleteImage(uploadedImg.public_id);
            } catch (cleanupError) {
                logger.error(cleanupError);
            }
        }

        throw error;
    }
}

export default { add, findByFilters, findOneCloth, updateClothById, deleteClothesById, analyzeClothing };