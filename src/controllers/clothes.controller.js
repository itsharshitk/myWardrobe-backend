import clothesService from "../services/clothes.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const addClothes = async (req, res) => {
    const result = await clothesService.add(req.user, req.body, req.files);

    res.status(201).json(
        new ApiResponse(201, "Item added successfully", result)
    )
}

const getClothes = async (req, res) => {
    const allowedFilters = [
        "name",
        "category",
        "color",
        "brand",
        "size",
        "season",
        "occasion"
    ];

    const filters = {userId: req.user.id};

    for(const key of allowedFilters){
        if(req.query[key] !== undefined){
            filters[key] = req.query[key]
        }
    }

    if(req.query.ai !== undefined){
        filters.aiGenerated = req.query.ai === "true";
    }

    if(req.query.fav !== undefined){
        filters.isFavourite = req.query.fav === "true";
    }

    if(req.query.archived !== undefined){
        filters.isArchived = req.query.archived === "true";
    }

    const result = await clothesService.find(filters)

    res.status(200).json(
        new ApiResponse(200, "Fetched clothes", result)
    )
}


export default {addClothes, getClothes};