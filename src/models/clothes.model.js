import mongoose from "mongoose";

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
            required: true
        },

        category: {
            type: String,
            required: true,
            enum: ["Top", "Bottom", "Dress", "Outerwear", "Innerwear", "Footwear", "Accessories"],
        },

        color: {
            type: String,
            lowercase: true,
        },

        brand: {
            type: String,
            lowercase: true,
        },

        size: String,

        season: {
            type: String,
            enum: ["Summer", "Winter", "Spring", "Autumn", "All Season"],
            default: "All Season",
        },

        occasion: {
            type: String,
            enum: ["Casual", "Office", "Party", "Wedding", "Travel", "Gym"],
            default: "Casual",
        },

        notes: String,

        images: [
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

export default mongoose.model("Clothes", clothesSchema);