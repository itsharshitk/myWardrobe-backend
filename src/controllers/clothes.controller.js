import clothesService from "../services/clothes.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const addClothes = async (req, res) => {
    const result = await clothesService.add(req.user, req.body, req.files);

    res.status(201).json(
        new ApiResponse(201, "Item added successfully", result)
    )
}

const getClothes = async (req, res) => {
    const filters = filterSchema.parse(req.query);

    const result = await clothesService.find(req.user.id, filters)

    res.status(200).json(
        new ApiResponse(200, "Fetched clothes", result)
    )
}

export default {addClothes, getClothes};