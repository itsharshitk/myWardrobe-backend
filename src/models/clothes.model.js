import mongoose from "mongoose";
import { CATEGORIES, DEFAULT_OCCASION, DEFAULT_SEASON, OCCASIONS, SEASONS } from "../constants/clothes.js";

const clothesSchema = new mongoose.Schema(
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

        clothesImage: {
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

        category: {
            type: String,
            required: true,
            enum: CATEGORIES,
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
            enum: SEASONS,
            default: DEFAULT_SEASON,
        },

        occasion: {
            type: String,
            enum: OCCASIONS,
            default: DEFAULT_OCCASION,
        },

        notes: String,

        aiGenerated: {
            type: Boolean,
            default: false
        },

        isFavourite: {
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
    name: "text"
})

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
    isFavourite: 1
})

export default mongoose.model("Clothing", clothesSchema);