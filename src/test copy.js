import OpenAI from "openai";
import { z } from "zod";
import config from "./config/config.js";
import { aiClothingSchema } from "./validations/aiClothing.validation.js";

const groq = new OpenAI({
    apiKey: config.groqKey,
    baseURL: "https://api.groq.com/openai/v1",
});

const analyzeClothing = async (imageUrl) => {
    const response = await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",

        messages: [
            {
                role: "system",
                content: `
                    You analyze clothing images.

                    Identify:
                    - clothing category
                    - visible colors
                    - brand if clearly visible
                    - suitable seasons
                    - suitable occasions

                    Rules:
                    - Do not guess the brand.
                    - If the brand cannot be identified, return null.
                    - Return ONLY valid JSON.
                `,
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze this clothing image.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ],

        response_format: {
            type: "json_schema",
            json_schema: {
                name: "clothing_analysis",
                strict: true,
                schema: zodToJsonSchema(aiClothingSchema),
            },
        },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty response");
    }

    const parsed = JSON.parse(content);

    // Validate the response with your Zod schema
    return aiClothingSchema.parse(parsed);
};

// Convert Zod schema to JSON Schema
function zodToJsonSchema(schema) {
    // For production, use zod-to-json-schema instead of maintaining
    // a manual conversion.
    return {
        type: "object",
        properties: {
            category: {
                type: "string",
            },
            colors: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            brand: {
                type: ["string", "null"],
            },
            seasons: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            occasions: {
                type: "array",
                items: {
                    type: "string",
                },
            },
        },
        required: [
            "category",
            "colors",
            "brand",
            "seasons",
            "occasions",
        ],
        additionalProperties: false,
    };
}

const result = await analyzeClothing(
    "https://images.unsplash.com/photo-1779896412190-49a2fd05bd74"
);

console.log(result);