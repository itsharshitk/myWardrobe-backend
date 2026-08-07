import logger from "../config/logger.js";
import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }

    async findByFilters(filters){
        const query = clothesModel.find(filters);

        // Inspect the filter object directly
        console.log("Running filter =======>>>>>>>>", query.getQuery()); 

        return await query;
    }

}

export default new ClothesRepository();