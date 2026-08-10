import z from "zod";

export const aiClothingSchema = z.object(
    {
        category: z.string(),

        colors: z.array( z.string() ),

        brand: z.string().nullable(),

        season: z.array( z.string() ),

        occasion: z.array( z.string() )
    }
)