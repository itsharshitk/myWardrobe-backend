import clothesService from "../services/clothes.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const addClothes = async (req, res) => {
    const result = await clothesService.add(req.user, req.body, req.files);

    console.log(result);

    res.status(201).json(
        new ApiResponse(201, "Item added successfully", result)
    )
}

export default {addClothes};