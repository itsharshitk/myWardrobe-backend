import mongoose from "mongoose";

const clothingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true  
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: ["top", "bottom", "dress", "outerwear", "innerwear", "footwear", "accessories"],
        },

        color: {
            type: String,
            lowercase: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        size: String,

        season: {
            type: String,
            enum: ["summer", "winter", "spring", "autumn", "all season"],
            default: "all season",
        },

        occasion: {
            type: String,
            enum: ["casual", "office", "party", "wedding", "travel", "gym"],
            default: "casual",
        },

        notes: String,

        images: {
            type: [
                {
                    _id: false,

                    url: {
                        type: String,
                        required: true
                    },
                    publicId: {
                        type: String,
                        required: true
                    },
                    size: Number,
                    width: Number,
                    height: Number
                }
            ],
            required: true,
            validate: {
                validator: (images) => images.length > 0,
                message: "Atleast one image is required"
            }
        },

        isFavorite: {
            type: Boolean,
            default: false
        },

        isArchived: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

clothesSchema.index({
    userId: 1,
    createdAt: -1
})

clothesSchema.index({
    userId: 1,
    category: 1
})

clothesSchema.index({
    userId: 1,
    color: 1
})

clothesSchema.index({
    userId: 1,
    season: 1
})

clothesSchema.index({
    userId: 1,
    occasion: 1
})

clothesSchema.index({
    userId: 1,
    isFavorite: 1
})

clothesSchema.index({
    userId: 1,
    name: "text"
})

export default mongoose.model("Clothing", clothingSchema);