import clothesService from "../services/clothes.service.js";

const addClothes = async (req, res) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req);

    const result = await clothesService.add(req.user, req.body, req.file);

    console.log(result);
}

export default {addClothes};