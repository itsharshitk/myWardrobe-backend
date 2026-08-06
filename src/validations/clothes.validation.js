import z from "zod";
import { CATEGORIES, DEFAULT_OCCASION, DEFAULT_SEASON, OCCASIONS, SEASONS } from "../constants/clothes.js";

export const clothesSchema = z.object(
    {
        name: z
            .string()
            .min(1, "Name is required")
            .trim(),

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