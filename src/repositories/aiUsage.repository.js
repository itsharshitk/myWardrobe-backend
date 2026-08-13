import AIUsage from '../models/aiUsage.model.js';

const create = async (userId, data) => {
    data.userId = userId;
    
    return AIUsage.create(data);
}

const findByUserId = async (userId) => {
    return AIUsage.find({ userId })
        .sort({ createdAt: -1 });
};

const getTotalCostByUser = async (userId) => {
    const [result] = await AIUsage.aggregate([
        {
            $match: {
                userId
            }
        },
        {
            $group: {
                _id: null,
                totalCost: {
                    $sum: "$totalCost"
                },
                totalTokens: {
                    $sum: "$totalTokens"
                },
                requests: {
                    $sum: 1
                }
            }
        }
    ]);

    return result || {
        totalCost: 0,
        totalTokens: 0,
        requests: 0
    };
};

export default {
    create,
    findByUserId,
    getTotalCostByUser
};