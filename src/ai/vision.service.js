import openai from "./openai.js";
import { zodTextFormat } from "openai/helpers/zod.js";
import { aiClothingSchema } from "../validations/aiClothing.validation.js";

const analyzeClothing = async (imageUrl) => {
    const resp = await openai.responses.parse({
        model: "gpt-4.1-mini",
        
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `
                            Analyze this clothing image.

                            Identify:
                            - clothing category
                            - visible colors
                            - brand if clearly visible
                            - suitable seasons
                            - suitable occasions

                            Do not guess the brand.
                            If the brand cannot be identified, return null.
                        `,
                    },
                    {
                        type: "input_image",
                        image_url: imageUrl
                    }
                ]
            }
        ],

        text: {
            format: zodTextFormat(
                aiClothingSchema,
                "clothing_analysis"
            )
        }
    });

    const usage = resp.usage;

    const inputTokens = usage?.input_tokens ?? 0;
    const outputTokens = usage?.output_tokens ?? 0;
    const totalTokens = usage?.total_tokens ?? 0;

    const inputCost =
        (inputTokens / 1_000_000) * 0.40;

    const outputCost =
        (outputTokens / 1_000_000) * 1.60;

    return {
        data: resp.output_parsed,

        usage: {
            operation: "clothing_analysis",
            model: "gpt-4.1-mini",

            inputTokens,
            outputTokens,
            totalTokens,

            inputCost,
            outputCost,
            totalCost: inputCost + outputCost,

            currency: "USD",

            // Save exactly what OpenAI returned
            rawUsage: usage
        }
    };
}

export default { analyzeClothing };