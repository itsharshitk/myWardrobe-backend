import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema(
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

        clothes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Clothes",
            }
        ],

        coverImage: {
            url: String,
            publicId: String,
            size: Number,
            width: Number,
            height: Number
        },

        isFavorite: {
            type: Boolean,
            default: false
        },

        notes: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
)

outfitSchema.index({
    userId: 1,
    isFavorite: 1
})

outfitSchema.index({
    notes: "text"
})

outfitSchema.index({
    userId: 1,
    createdAt: -1
})

export default mongoose.model("Outfit", outfitSchema);