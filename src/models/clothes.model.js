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
            enum: ["Top", "Bottom", "Dress", "Outerwear", "Innerwear", "Footwear", "Accessories"],
            index: true
        },

        color: {
            type: String,
            index: true
        },

        brand: String,

        size: String,

        season: {
            type: String,
            enum: ["Summer", "Winter", "Spring", "Autumn", "All Season"],
            default: "All Season",
            index: true
        },

        occasion: {
            type: String,
            enum: ["Casual", "Office", "Party", "Wedding", "Travel", "Gym"],
            default: "Casual",
            index: true
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
            default: false,
            index: true
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

export default mongoose.model("Clothes", clothesSchema);