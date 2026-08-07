import logger from "../config/logger.js";
import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }

    async findByFilters(filters){
        return clothesModel.find(filters)
    }

}

export default new ClothesRepository();