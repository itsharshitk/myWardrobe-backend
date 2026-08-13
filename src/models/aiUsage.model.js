const aiUsageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        clothingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            index: true
        },

        operation: {
            type: String,
            required: true,
            index: true
        },

        model: {
            type: String,
            required: true
        },

        inputTokens: {
            type: Number,
            default: 0
        },

        outputTokens: {
            type: Number,
            default: 0
        },

        totalTokens: {
            type: Number,
            default: 0
        },

        inputCost: {
            type: Number,
            default: 0
        },

        outputCost: {
            type: Number,
            default: 0
        },

        totalCost: {
            type: Number,
            default: 0
        },

        currency: {
            type: String,
            default: "USD"
        },

        // Complete usage object returned by OpenAI
        rawUsage: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const AIUsage = mongoose.model("AIUsage", aiUsageSchema);