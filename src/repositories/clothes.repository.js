import logger from "../config/logger.js";
import clothesModel from "../models/clothes.model.js"

class ClothesRepository {
    async create(data) {
        return clothesModel.create(data)
    }

    async findPaginated(filters, { skip, limit }) {
        const items = await clothesModel
            .find(filters)
            .sort({
                createdAt: -1,
                _id: -1,
            })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasNextPage = items.length > limit;

        if (hasNextPage) {
            items.pop();
        }

        return {
            items,
            hasNextPage,
        };
    }

    async findById(id, userId) {
        return clothesModel.findOne({_id: id, userId});
    }

    async updateById(id, data, options = {}) {
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