import logger from "../config/logger.js";
import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }

    async filter(filters){
        return clothesModel.find(filters)
    }

    async findOneCloth(userId, id) {
        return clothesModel.findOne({_id: id, userId});
    }

}

export default new ClothesRepository();