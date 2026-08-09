import clothesService from "../services/clothes.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

const addClothes = async (req, res) => {
    const result = await clothesService.add(req.user, req.body, req.files);

    res.status(201).json(
        new ApiResponse(201, "Item added successfully", result)
    )
}

const filterClothes = async (req, res) => {
    const userId = req.user.id;
    const queryParams = req.query;

    const result = await clothesService.findByFilters(userId, queryParams);

    res.status(200).json(
        new ApiResponse(200, "Fetched clothes", result)
    )
}

const getClothesById = async (req, res) => {
    const id = req.params;
    const userId = req.user.id;

    // Prevent Mongoose CastError crash on malformed string IDs
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "No clothes found");
    }
    
    const result = await clothesService.findOneCloth(id, userId);
    
    res.status(200).json(
        new ApiResponse(200, "Fetched clothes successfully", result)
    )
}

const updateCloth = async (req, res) => {
    const id = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(404, "No such clothes found");
    }

    const result = await clothesService.updateClothById(id, userId, req.body, req.files);
 
    res.status(200).json(
        new ApiResponse(200, "Clothes updated successfully", result)
    )

}

export default {addClothes, filterClothes, getClothesById, updateCloth};