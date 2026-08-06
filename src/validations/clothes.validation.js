import z from "zod";
import { CATEGORIES, DEFAULT_OCCASION, DEFAULT_SEASON, OCCASIONS, SEASONS } from "../constants/clothes.js";

export const clothesSchema = z.object(
    {
        name: z
            .string()
            .min(1, "Name is required")
            .trim(),

        clothesImage: z
            .array(
                z.object({
                    url: z.string().url(1, "Invalid image URL"),
                    publicId: z.string().min(1, "PublicId is required"),
                    size: z.number().optional(),
                    width: z.number().optional(),
                    height: z.number().optional()
                })
            )
            .min(1, "Atleast one image is required"),

        category: z.enum(CATEGORIES),

        color: z
            .string()
            .trim()
            .toLowerCase()
            .optional(),
        
        brand: z
            .string()
            .trim()
            .optional(),

        size: z
            .string()
            .optional(),

        season: z.enum(SEASONS).default(DEFAULT_SEASON),

        occasion: z.enum(OCCASIONS).default(DEFAULT_OCCASION),

        notes: z.string().optional(),

        aiGenerated: z.boolean().default(false),

        isFavorite: z.boolean().default(false),

        isArchived: z.boolean().default(false)
    }
)