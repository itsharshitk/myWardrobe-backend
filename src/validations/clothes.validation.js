import { z } from "zod";
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

const booleanString = z.enum(["true", "false"]).transform(value => value === "true").optional();
export const filterSchema = z.object(
    {
        name: z.string().trim().optional(),

        category: z.enum(CATEGORIES).optional(),

        color: z.string().trim().toLowerCase().optional(),
        
        brand: z.string().trim().optional(),

        size: z.string().optional(),

        season: z.enum(SEASONS).optional(),

        occasion: z.enum(OCCASIONS).optional(),

        ai: booleanString,

        fav: booleanString,

        archived: booleanString
    }
)
.strict()
.transform(({ ai, fav, archived, ...filters }) => ({
    ...filters,

    ...(ai !== undefined && { aiGenerated: ai }),
    ...(fav !== undefined && { isFavorite: fav }),
    ...(archived !== undefined && { isArchived: archived }),
}));