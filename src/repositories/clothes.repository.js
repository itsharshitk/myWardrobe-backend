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

    async updateById(id, data, options = {}){
        return clothesModel.findByIdAndUpdate(id, data, {
            runValidators: true,
            ...options
        })
    }

    async deleteByIdAndUser(id, userId) {
        return clothesModel.findOneAndDelete({
            _id: id,
            userId
        });
    }
}

export default new ClothesRepository();