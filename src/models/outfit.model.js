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

        clothes: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Clothes",
                }
            ],
            required: true,
            validate: {
                validator: (clothes) => clothes.length > 1,
                message: "Outfit must contain at least two clothes"
            }
        },

        isFavourite: {
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
    isFavourite: 1
})

outfitSchema.index({
    name: "text",
    notes: "text"
})

outfitSchema.index({
    userId: 1,
    createdAt: -1
})

export default mongoose.model("Outfit", outfitSchema);