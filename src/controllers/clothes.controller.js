import service from "../services/clothes.service.js";

const addClothes = async (req, res) => {
    const result = await service.addClothes(req.user, req.body, req.file);

    console.log(result);
}

export default {addClothes};