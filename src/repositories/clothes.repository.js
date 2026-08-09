import logger from "../config/logger.js";
import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }

    async filter(filters){
        return clothesModel.find(filters)
    }

    async findById(id, userId) {
        return clothesModel.findOne({_id: id, userId});
    }

    async updateById()
}

export default new ClothesRepository();