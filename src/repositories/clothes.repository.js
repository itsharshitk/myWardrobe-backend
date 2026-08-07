import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }
}

export default new ClothesRepository();